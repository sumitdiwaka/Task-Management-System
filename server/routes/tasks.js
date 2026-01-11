const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateTaskCreate, validateTaskUpdate, validate } = require('../utils/validation');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/taskController');

// IMPORTANT: Import Task model for test route
const Task = require('../models/Task');

// Debug middleware to log all task routes
router.use((req, res, next) => {
  console.log(`Task Route: ${req.method} ${req.path}`);
  next();
});

// All routes are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for logged in user
// @access  Private
router.get('/', getTasks);

// @route   GET /api/tasks/stats
// @desc    Get task statistics
// @access  Private
router.get('/stats', getTaskStats);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', getTask);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', validateTaskCreate, validate, createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', validateTaskUpdate, validate, updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', deleteTask);

// TEST ROUTE: Create task without validation (for debugging)
router.post('/test/create', async (req, res) => {
  try {
    console.log('=== TEST CREATE ROUTE (NO VALIDATION) ===');
    console.log('User:', req.user.id);
    console.log('Body:', req.body);
    
    const task = await Task.create({
      title: req.body.title || 'Test Task',
      description: req.body.description || 'Test Description',
      status: 'pending',
      priority: 'medium',
      user: req.user.id
    });
    
    res.json({
      success: true,
      message: 'Test route successful',
      data: task
    });
  } catch (error) {
    console.error('Test create error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;