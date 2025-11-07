const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Buffer compatibility fix for Node.js v25+
// This resolves the "Cannot read properties of undefined (reading 'prototype')" error
// in buffer-equal-constant-time package
if (typeof require !== 'undefined') {
  try {
    const bufferModule = require('buffer');
    
    // Ensure Buffer exists
    if (!global.Buffer) {
      global.Buffer = bufferModule.Buffer;
    }
    
    // Polyfill for SlowBuffer if needed
    if (bufferModule && !bufferModule.SlowBuffer) {
      bufferModule.SlowBuffer = function SlowBuffer() {};
      if (bufferModule.Buffer) {
        bufferModule.SlowBuffer.prototype = Object.create(bufferModule.Buffer.prototype);
      }
    }
    
    // Additional polyfill for Buffer methods that might be missing
    if (bufferModule.Buffer && !bufferModule.Buffer.isBuffer) {
      bufferModule.Buffer.isBuffer = function isBuffer(obj) {
        return obj instanceof bufferModule.Buffer;
      };
    }
  } catch (bufferError) {
    console.warn('Buffer compatibility polyfill warning:', bufferError.message);
  }
}

// Import routes
const authRoutes = require('./Routes/Auth');
const destinationRoutes = require('./Routes/destination');
const tripRoutes = require('./Routes/Trip');
const journalRoutes = require('./Routes/journals');
const adminRoutes = require('./Routes/admin');

// Import database connection
const connection = require('./db/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://wanderwiseca.netlify.app',
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/admin', adminRoutes);

// Welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to WanderWise API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      destinations: '/api/destinations',
      trips: '/api/trips',
      journals: '/api/journals',
      admin: '/api/admin'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      message: 'Validation error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
      field
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
// Use 5002 as the default port to avoid conflicts with macOS system services
const PORT = process.env.PORT || 5002;

// Add compatibility check for buffer
try {
  // Ensure Buffer is properly defined
  if (typeof Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer;
  }
} catch (bufferError) {
  console.warn('Buffer compatibility warning:', bufferError.message);
}

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📊 MongoDB: Connected successfully`);
  } catch (error) {
    console.error('Error during server startup:', error);
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;