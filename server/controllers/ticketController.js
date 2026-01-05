import Ticket from '../models/Ticket.js';
import User from '../models/User.js';
import { classifyTicket } from '../services/nlpService.js';
import { sendTicketCreatedEmail, sendTicketAssignedEmail, sendTicketResolvedEmail } from '../services/emailService.js';

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    // Use NLP to classify if not provided
    let ticketData = {
      title,
      description,
      createdBy: req.user._id
    };

    // If category/priority not provided, use NLP classification
    if (!category || !priority) {
      const classification = classifyTicket(description);
      ticketData.category = category || classification.category;
      ticketData.priority = priority || classification.priority;
      ticketData.assignedTeam = classification.assignedTeam;
    } else {
      ticketData.category = category;
      ticketData.priority = priority;
    }

    const ticket = await Ticket.create(ticketData);

    // Populate created by
    await ticket.populate('createdBy', 'name email');

    // Send email notification
    try {
      await sendTicketCreatedEmail(ticket, req.user);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tickets (for agents/admin)
// @route   GET /api/tickets
// @access  Private (Agent, Admin)
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, priority, category, assignedTo, search } = req.query;

    let query = {};

    // Filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email department')
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my tickets
// @route   GET /api/tickets/my
// @access  Private
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id })
      .populate('assignedTo', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
export const getTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email department avatar')
      .populate('assignedTo', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .populate('timeline.user', 'name');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user owns ticket or is agent/admin
    if (
      ticket.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role === 'employee'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private (Agent, Admin)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, resolutionNotes } = req.body;

    let ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    const oldStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = Date.now();
      if (resolutionNotes) {
        ticket.resolutionNotes = resolutionNotes;
      }
    }

    // Add timeline entry
    ticket.timeline.push({
      action: 'status_changed',
      user: req.user._id,
      details: `Status changed from ${oldStatus} to ${status}`
    });

    await ticket.save();

    // Send email if resolved
    if (status === 'resolved') {
      try {
        await sendTicketResolvedEmail(ticket, ticket.createdBy);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to agent
// @route   PUT /api/tickets/:id/assign
// @access  Private (Agent, Admin)
export const assignTicket = async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Verify assignee exists and is agent/admin
    const agent = await User.findById(assignedTo);
    if (!agent || agent.role === 'employee') {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent assignment'
      });
    }

    ticket.assignedTo = assignedTo;
    ticket.status = 'in-progress';

    // Add timeline entry
    ticket.timeline.push({
      action: 'assigned',
      user: req.user._id,
      details: `Ticket assigned to ${agent.name}`
    });

    await ticket.save();

    // Send email to assigned agent
    try {
      await sendTicketAssignedEmail(ticket, agent);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.comments.push({
      user: req.user._id,
      text
    });

    // Add timeline entry
    ticket.timeline.push({
      action: 'comment_added',
      user: req.user._id,
      details: 'Comment added'
    });

    await ticket.save();

    await ticket.populate('comments.user', 'name avatar');

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (Admin only)
export const deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await ticket.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket statistics
// @route   GET /api/tickets/stats
// @access  Private (Agent, Admin)
export const getTicketStats = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });

    // Tickets by category
    const ticketsByCategory = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Tickets by priority
    const ticketsByPriority = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Average resolution time
    const resolvedWithTime = await Ticket.find({
      status: 'resolved',
      resolvedAt: { $exists: true }
    });

    let avgResolutionTime = 0;
    if (resolvedWithTime.length > 0) {
      const totalTime = resolvedWithTime.reduce((acc, ticket) => {
        const resolutionTime = ticket.resolvedAt - ticket.createdAt;
        return acc + resolutionTime;
      }, 0);
      avgResolutionTime = totalTime / resolvedWithTime.length;
    }

    res.status(200).json({
      success: true,
      data: {
        totalTickets,
        openTickets,
        inProgressTickets,
        resolvedTickets,
        ticketsByCategory,
        ticketsByPriority,
        avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60)) // in hours
      }
    });
  } catch (error) {
    next(error);
  }
};
