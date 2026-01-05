import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import knowledgeRoutes from './routes/knowledge.js';
import userRoutes from './routes/users.js';
import { errorHandler } from './middleware/error.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

export default app;
