import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['Password Reset', 'VPN Issues', 'Software Installation', 'Hardware Issues', 'Network Issues', 'Email Issues', 'Other'],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedTeam: {
    type: String,
    default: 'Support'
  },
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  timeline: [{
    action: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String
  }],
  resolvedAt: {
    type: Date,
    default: null
  },
  resolutionNotes: {
    type: String,
    default: ''
  },
  tags: [String]
}, {
  timestamps: true
});

// Generate ticket number before saving
ticketSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  const count = await mongoose.model('Ticket').countDocuments();
  this.ticketNumber = `TKT-${String(count + 1).padStart(6, '0')}`;
  
  // Add creation timeline entry
  this.timeline.push({
    action: 'created',
    user: this.createdBy,
    details: 'Ticket created'
  });
  
  next();
});

// Add indexes for performance
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ category: 1 });

export default mongoose.model('Ticket', ticketSchema);
