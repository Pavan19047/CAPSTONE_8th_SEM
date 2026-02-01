import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  MessageSquare,
  User,
  Calendar,
  Tag
} from 'lucide-react';
import { ticketService } from '../../services/api';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { SkeletonCard } from '../ui/Skeleton';

const TicketDetail = ({ ticketId, onUpdate }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getTicket(ticketId);
      setTicket(response.data);
    } catch (error) {
      console.error('Error loading ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setAddingComment(true);
      await ticketService.addComment(ticketId, comment);
      setComment('');
      await loadTicket();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setAddingComment(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'resolved') {
      setShowResolveModal(true);
      return;
    }

    try {
      setUpdatingStatus(true);
      await ticketService.updateStatus(ticketId, { status: newStatus });
      await loadTicket();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleResolve = async () => {
    try {
      setUpdatingStatus(true);
      await ticketService.updateStatus(ticketId, {
        status: 'resolved',
        resolutionNotes: resolutionNotes
      });
      setShowResolveModal(false);
      setResolutionNotes('');
      await loadTicket();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error resolving ticket:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Ticket not found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="primary">{ticket.ticketNumber}</Badge>
            <Badge variant={ticket.status}>{ticket.status}</Badge>
            <Badge variant={ticket.priority}>{ticket.priority}</Badge>
          </div>

          {/* Status Change Dropdown */}
          {ticket.status !== 'closed' && (
            <select
              value={ticket.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updatingStatus}
              className="input-field text-sm py-1 px-3 w-auto"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          )}
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">{ticket.title}</h2>
        <p className="text-text-secondary">{ticket.description}</p>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted">Category:</span>
            <Badge variant="default" size="sm">{ticket.category}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted">Created:</span>
            <span className="text-text-primary">
              {new Date(ticket.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted">Created by:</span>
            <span className="text-text-primary">{ticket.createdBy?.name}</span>
          </div>
          {ticket.assignedTo && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-text-muted" />
              <span className="text-text-muted">Assigned to:</span>
              <span className="text-text-primary">{ticket.assignedTo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Resolution Notes */}
      {ticket.resolutionNotes && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-accent-success/10 border border-accent-success/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-accent-success" />
            <span className="font-semibold text-accent-success">Resolution</span>
          </div>
          <p className="text-text-secondary">{ticket.resolutionNotes}</p>
        </motion.div>
      )}

      {/* Timeline */}
      {ticket.timeline && ticket.timeline.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-4">Timeline</h3>
          <div className="space-y-4">
            {ticket.timeline.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-accent-primary" />
                  {index < ticket.timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gray-700 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-text-primary font-medium">{event.details}</p>
                  <p className="text-text-muted text-sm">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Comments ({ticket.comments?.length || 0})
        </h3>

        {ticket.comments && ticket.comments.length > 0 && (
          <div className="space-y-4 mb-4">
            {ticket.comments.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-primary-card p-4 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <span className="text-sm text-accent-primary">
                      {comment.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">{comment.user?.name || 'User'}</p>
                    <p className="text-text-muted text-xs">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-text-secondary">{comment.text}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <div className="space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="input-field resize-none"
          />
          <Button
            onClick={handleAddComment}
            loading={addingComment}
            disabled={!comment.trim()}
            size="sm"
          >
            Add Comment
          </Button>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowResolveModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-primary-card p-6 rounded-xl border border-gray-700 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-accent-success" />
              <h3 className="text-xl font-bold text-text-primary">Resolve Ticket</h3>
            </div>

            <p className="text-text-secondary mb-4">
              Add resolution notes to help the user understand how the issue was resolved.
            </p>

            <textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe how the issue was resolved..."
              rows={4}
              className="input-field resize-none mb-4"
            />

            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowResolveModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleResolve}
                loading={updatingStatus}
              >
                Resolve Ticket
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TicketDetail;
