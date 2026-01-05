import KnowledgeBase from '../models/KnowledgeBase.js';
import { searchKnowledgeBase, classifyTicket } from '../services/nlpService.js';

// @desc    Search knowledge base
// @route   GET /api/knowledge/search
// @access  Private
export const searchKnowledge = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    // Get all published articles
    const allArticles = await KnowledgeBase.find({ isPublished: true });

    // Use NLP to find relevant articles
    const results = searchKnowledgeBase(query, allArticles);

    // Also classify the query to suggest category
    const classification = classifyTicket(query);

    res.status(200).json({
      success: true,
      data: {
        results,
        suggestedCategory: classification.category,
        confidence: classification.confidence
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all knowledge base articles
// @route   GET /api/knowledge
// @access  Private
export const getAllArticles = async (req, res, next) => {
  try {
    const { category } = req.query;

    let query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const articles = await KnowledgeBase.find(query)
      .sort('-views')
      .limit(50);

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single knowledge base article
// @route   GET /api/knowledge/:id
// @access  Private
export const getArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeBase.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create knowledge base article
// @route   POST /api/knowledge
// @access  Private (Agent, Admin)
export const createArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeBase.create(req.body);

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update knowledge base article
// @route   PUT /api/knowledge/:id
// @access  Private (Agent, Admin)
export const updateArticle = async (req, res, next) => {
  try {
    const article = await KnowledgeBase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark article as helpful/not helpful
// @route   POST /api/knowledge/:id/feedback
// @access  Private
export const articleFeedback = async (req, res, next) => {
  try {
    const { helpful } = req.body;

    const article = await KnowledgeBase.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (helpful) {
      article.helpful += 1;
    } else {
      article.notHelpful += 1;
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};
