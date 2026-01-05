import express from 'express';
import {
  searchKnowledge,
  getAllArticles,
  getArticle,
  createArticle,
  updateArticle,
  articleFeedback
} from '../controllers/knowledgeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', protect, searchKnowledge);

router
  .route('/')
  .get(protect, getAllArticles)
  .post(protect, authorize('agent', 'admin'), createArticle);

router
  .route('/:id')
  .get(protect, getArticle)
  .put(protect, authorize('agent', 'admin'), updateArticle);

router.post('/:id/feedback', protect, articleFeedback);

export default router;
