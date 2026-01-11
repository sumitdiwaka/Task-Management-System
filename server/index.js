const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS - Update this line for Vite
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Test MongoDB connection before starting server
connectDB().then(() => {
  console.log('MongoDB connection established');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

// Welcome route
app.get('/api-docs', (req, res) => {
  const docs = {
    baseURL: 'http://localhost:5000/api',
    endpoints: {
      auth: {
        register: {
          method: 'POST',
          url: '/auth/register',
          body: {
            name: 'string',
            email: 'string',
            password: 'string',
            confirmPassword: 'string'
          }
        },
        login: {
          method: 'POST',
          url: '/auth/login',
          body: {
            email: 'string',
            password: 'string'
          }
        },
        profile: {
          get: {
            method: 'GET',
            url: '/auth/profile',
            headers: 'Authorization: Bearer <token>'
          },
          update: {
            method: 'PUT',
            url: '/auth/profile',
            headers: 'Authorization: Bearer <token>',
            body: {
              name: 'string',
              email: 'string'
            }
          }
        }
      },
      tasks: {
        getAll: {
          method: 'GET',
          url: '/tasks',
          headers: 'Authorization: Bearer <token>',
          queryParams: {
            status: 'pending|in-progress|completed|all',
            priority: 'low|medium|high|all',
            search: 'string',
            sort: '-createdAt|-updatedAt|title'
          }
        },
        getOne: {
          method: 'GET',
          url: '/tasks/:id',
          headers: 'Authorization: Bearer <token>'
        },
        create: {
          method: 'POST',
          url: '/tasks',
          headers: 'Authorization: Bearer <token>',
          body: {
            title: 'string',
            description: 'string',
            status: 'pending|in-progress|completed',
            priority: 'low|medium|high',
            dueDate: 'ISO8601 Date'
          }
        },
        update: {
          method: 'PUT',
          url: '/tasks/:id',
          headers: 'Authorization: Bearer <token>',
          body: {
            title: 'string',
            description: 'string',
            status: 'pending|in-progress|completed',
            priority: 'low|medium|high',
            dueDate: 'ISO8601 Date'
          }
        },
        delete: {
          method: 'DELETE',
          url: '/tasks/:id',
          headers: 'Authorization: Bearer <token>'
        },
        stats: {
          method: 'GET',
          url: '/tasks/stats',
          headers: 'Authorization: Bearer <token>'
        }
      }
    }
  };
  
  res.json({
    success: true,
    message: 'API Documentation',
    data: docs
  });
});

// API Routes (we'll add these in next step)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});