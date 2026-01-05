import express from 'express';
import {
  createTicket,
  getAllTickets,
  getMyTickets,
  getTicket,
  updateTicketStatus,
  assignTicket,
  addComment,
  deleteTicket,
  getTicketStats
} from '../controllers/ticketController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router
  .route('/')
  .post(protect, createTicket)
  .get(protect, authorize('agent', 'admin'), getAllTickets);

router.get('/my', protect, getMyTickets);
router.get('/stats', protect, authorize('agent', 'admin'), getTicketStats);

router
  .route('/:id')
  .get(protect, getTicket)
  .delete(protect, authorize('admin'), deleteTicket);

router.put('/:id/status', protect, authorize('agent', 'admin'), updateTicketStatus);
router.put('/:id/assign', protect, authorize('agent', 'admin'), assignTicket);
router.post('/:id/comments', protect, addComment);

export default router;
