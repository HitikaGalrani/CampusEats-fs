const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

dotenv.config();

// ==================================================
// Connect Database
// ==================================================
connectDB();

const app = express();
const server = http.createServer(app);

// ==================================================
// Security Middleware - EXPERIMENT 5
// ==================================================

// Helmet adds security-related HTTP headers
app.use(helmet());

// CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// ==================================================
// Rate Limiting - EXPERIMENT 5
// ==================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests from this IP. Please try again later.'
  }
});

// Apply rate limiting to API routes
app.use('/api/', apiLimiter);

// ==================================================
// Socket.IO Setup
// ==================================================

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Initialize Socket.IO logic
initSocket(io);

// ==================================================
// Health Check
// ==================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CampusEats Backend API is running healthy'
  });
});

// ==================================================
// API Routes
// ==================================================

app.use('/api/auth', authRoutes);

app.use('/api/menu', menuRoutes);

app.use('/api/categories', categoryRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/ratings', ratingRoutes);

app.use('/api/admin', adminRoutes);

app.use('/api/notifications', notificationRoutes);

// ==================================================
// Error Handling Middleware
// ==================================================

// Handles routes that do not exist
app.use(notFound);

// Handles application errors
app.use(errorHandler);

// ==================================================
// Start Server
// ==================================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 CampusEats Server running on port ${PORT}`);
  console.log(`🔒 Helmet security enabled`);
  console.log(`🛡️ Rate limiting enabled`);
  console.log(`🌐 Socket.IO WebSockets initialized`);
  console.log(`==================================================`);
});