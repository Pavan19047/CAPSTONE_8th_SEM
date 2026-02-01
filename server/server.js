import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5001;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start server and handle listen errors (e.g. port already in use)
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`
Error: Port ${PORT} is already in use.
Kill the process using the port or set a different PORT in your environment.
Example to find and kill (macOS):
  lsof -nP -iTCP:${PORT} -sTCP:LISTEN
  kill <PID>
Or use: npx kill-port ${PORT}
`);
        process.exit(1);
      }
      // If it's a different error, rethrow
      throw err;
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
