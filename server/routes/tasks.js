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


const Task = require('../models/Task');


router.use((req, res, next) => {
  console.log(`Task Route: ${req.method} ${req.path}`);
  next();
});


router.use(protect);

router.get('/', getTasks);

router.get('/stats', getTaskStats);

router.get('/:id', getTask);

router.post('/', validateTaskCreate, validate, createTask);
// router.post('/', createTask);

router.put('/:id', validateTaskUpdate, validate, updateTask);

router.delete('/:id', deleteTask);


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