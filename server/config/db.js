/**
 * MongoDB Database Connection
 * DigitalKhalane Platform
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    console.log('📡 Attempting to connect to MongoDB...');
    console.log('🔗 Connection String (masked):', process.env.MONGO_URI.replace(/:(.*?)@/, ':****@'));

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);

    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Error:', err.message);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    
    if (error.message.includes('MONGO_URI')) {
      console.error('\n⚠️  CRITICAL: MONGO_URI not configured');
      console.error('   Add MONGO_URI to your .env file');
      console.error('   Example: MONGO_URI=mongodb://localhost:27017/digitalkhalane');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
