const mongoose = require('mongoose');
const dns = require('dns');

// Resolve querySrv ECONNREFUSED issues by setting public DNS servers
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.warn('WARNING: MONGO_URI is not set in environment variables. Falling back to local MongoDB.');
    }
    const conn = await mongoose.connect(mongoURI || 'mongodb://127.0.0.1:27017/ecotrack');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
