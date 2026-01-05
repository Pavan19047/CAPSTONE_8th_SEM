import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendTicketCreatedEmail = async (ticket, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Ticket Created: ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">Ticket Created Successfully</h2>
          <p>Hello ${user.name},</p>
          <p>Your ticket has been created successfully and our team will review it shortly.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details</h3>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Category:</strong> ${ticket.category}</p>
            <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            <p><strong>Status:</strong> ${ticket.status.toUpperCase()}</p>
          </div>
          
          <p>You can track your ticket status by logging into the helpdesk portal.</p>
          <a href="${process.env.CLIENT_URL}/tickets/${ticket._id}" 
             style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 10px 0;">
            View Ticket
          </a>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Thank you,<br/>
            Smart Helpdesk Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Ticket created email sent successfully');
  } catch (error) {
    console.error('Error sending ticket created email:', error);
  }
};

export const sendTicketAssignedEmail = async (ticket, agent) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: agent.email,
      subject: `New Ticket Assigned: ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366F1;">New Ticket Assigned</h2>
          <p>Hello ${agent.name},</p>
          <p>A new ticket has been assigned to you.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details</h3>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            <p><strong>Category:</strong> ${ticket.category}</p>
            <p><strong>Priority:</strong> ${ticket.priority.toUpperCase()}</p>
            <p><strong>Description:</strong> ${ticket.description}</p>
          </div>
          
          <a href="${process.env.CLIENT_URL}/agent/tickets/${ticket._id}" 
             style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 10px 0;">
            View Ticket
          </a>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Thank you,<br/>
            Smart Helpdesk Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Ticket assigned email sent successfully');
  } catch (error) {
    console.error('Error sending ticket assigned email:', error);
  }
};

export const sendTicketResolvedEmail = async (ticket, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: `Ticket Resolved: ${ticket.ticketNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #22C55E;">Ticket Resolved</h2>
          <p>Hello ${user.name},</p>
          <p>Great news! Your ticket has been resolved.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Ticket Details</h3>
            <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Title:</strong> ${ticket.title}</p>
            ${ticket.resolutionNotes ? `<p><strong>Resolution:</strong> ${ticket.resolutionNotes}</p>` : ''}
          </div>
          
          <p>If you have any questions or the issue persists, please feel free to reopen this ticket or create a new one.</p>
          
          <a href="${process.env.CLIENT_URL}/tickets/${ticket._id}" 
             style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; margin: 10px 0;">
            View Ticket
          </a>
          
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Thank you,<br/>
            Smart Helpdesk Team
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Ticket resolved email sent successfully');
  } catch (error) {
    console.error('Error sending ticket resolved email:', error);
  }
};
