/**
 * DigitalKhalane - Khalane Yatra Utsav Platform
 * Main Server Entry Point
 * Created by Harshal Parmeshvar Patil
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Validate critical environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);
if (missingVars.length > 0) {
  console.error('❌ CRITICAL: Missing environment variables:', missingVars.join(', '));
  console.error('📝 Please configure .env file with required variables');
  process.exit(1);
}

// Connect to MongoDB
console.log('🔄 Initializing database connection...');
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/registrations', require('./routes/registrations'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/gallery',       require('./routes/gallery'));
app.use('/api/donations',     require('./routes/donations'));
app.use('/api/contact',       require('./routes/contact'));
app.use('/api/content',       require('./routes/content'));
app.use('/api/stats',         require('./routes/stats'));

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

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
  });
});

// ─── Error Handler (MUST be last) ────────────────────────────────────────────
app.use(require('./middleware/errorHandler'));

// ─── Unhandled Promise Rejection Handler ──────────────────────────────────────
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  console.error('Stack:', err.stack);
});

process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   🎪  DigitalKhalane API Server Started          ║
║   🌐  http://localhost:${PORT}                      ║
║   👤  Created by Harshal Parmeshvar Patil        ║
╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
