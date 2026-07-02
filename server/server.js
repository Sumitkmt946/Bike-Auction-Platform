const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const initializeSocket = require('./socket/socketHandler');
const errorHandler = require('./middleware/errorHandler');
const { scheduleExistingAuctions } = require('./utils/auctionScheduler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bikeRoutes = require('./routes/bikeRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO and store on app for controller access
const io = initializeSocket(server);
app.set('io', io);

// --------------- Global Middleware ---------------

// Security headers
app.use(helmet());

// CORS — allow all origins
app.use(cors({ origin: '*' }));

// Parse JSON request bodies
app.use(express.json());

// HTTP request logging via Morgan → Winston
app.use(morgan('combined', { stream: logger.stream }));

// --------------- API Routes ---------------

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikeRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/auctions', bidRoutes); // Bid routes nested under /api/auctions/:auctionId/bids

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bike Auction API is running',
    timestamp: new Date().toISOString(),
  });
});

// --------------- Error Handler ---------------

app.use(errorHandler);

// --------------- Start Server ---------------

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Schedule existing active/upcoming auctions
    await scheduleExistingAuctions(io);

    // Start listening
    server.listen(PORT, () => {
      logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      logger.info(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = { app, server };
