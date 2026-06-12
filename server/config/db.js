/**
 * MongoDB Database Connection with Caching for Serverless
 * DigitalKhalane Platform
 */

const mongoose = require('mongoose');

// Global cached connection for serverless
let cachedConnection = null;

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Return cached connection if available and ready
    if (cachedConnection && mongoose.connection.readyState === 1) {
      return cachedConnection;
    }

    console.log('📡 Attempting to connect to MongoDB...');
    console.log('🔗 Connection String (masked):', process.env.MONGO_URI.replace(/:(.*?)@/, ':****@'));

    // Serverless-optimized connection options
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 0,
      bufferCommands: false,
    });

    cachedConnection = conn;

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
      cachedConnection = null;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    cachedConnection = null;
    
    if (error.message.includes('MONGO_URI')) {
      console.error('\n⚠️  CRITICAL: MONGO_URI not configured');
      console.error('   Add MONGO_URI to your .env file');
      console.error('   Example: MONGO_URI=mongodb://localhost:27017/digitalkhalane');
    }

    // Don't exit in serverless - let the function handle it
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
};

// Helper to get connection status
const getConnectionStatus = () => {
  return {
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name,
  };
};

module.exports = { connectDB, getConnectionStatus };