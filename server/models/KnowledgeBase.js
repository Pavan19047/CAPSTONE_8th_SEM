import mongoose from 'mongoose';

const knowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  keywords: [String],
  problem: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  steps: [String],
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeBase'
  }],
  views: {
    type: Number,
    default: 0
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Text search index
knowledgeBaseSchema.index({ 
  title: 'text', 
  problem: 'text', 
  keywords: 'text' 
});

export default mongoose.model('KnowledgeBase', knowledgeBaseSchema);
