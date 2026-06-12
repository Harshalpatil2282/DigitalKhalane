/**
 * Vercel Serverless Function Entry Point
 * DigitalKhalane API - Exports Express app as serverless handler
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../config/db');

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ CRITICAL: Missing environment variables:', missingVars.join(', '));
}

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
    ].filter(Boolean);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// ─── Database Connection ──────────────────────────────────────────────────────
// Connect on first invocation, reuse cached connection
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error.message);
    }
  }
  next();
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          require('../routes/auth'));
app.use('/api/events',        require('../routes/events'));
app.use('/api/registrations', require('../routes/registrations'));
app.use('/api/announcements', require('../routes/announcements'));
app.use('/api/gallery',       require('../routes/gallery'));
app.use('/api/donations',     require('../routes/donations'));
app.use('/api/contact',       require('../routes/contact'));
app.use('/api/content',       require('../routes/content'));
app.use('/api/stats',         require('../routes/stats'));

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DigitalKhalane API is running 🎉',
    creator: 'Harshal Parmeshvar Patil',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ─── Error Handler (MUST be last) ────────────────────────────────────────────
app.use(require('../middleware/errorHandler'));

// Export for Vercel serverless
module.exports = app;