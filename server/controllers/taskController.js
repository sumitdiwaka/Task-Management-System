const Task = require('../models/Task');

// Helper function to sanitize task data
const sanitizeTaskData = (body, userId) => {
  return {
    title: body.title || '',
    description: body.description || '',
    status: body.status || 'pending',
    priority: body.priority || 'medium',
    dueDate: body.dueDate || null,
    user: userId // Always use authenticated user ID
  };
};


const getTasks = async (req, res) => {
  try {
    console.log('=== GET TASKS ===');
    console.log('User:', req.user.id);
    
    const { status, priority, search, sort = '-createdAt' } = req.query;
    
    // Build query object
    const query = { user: req.user.id };
    
    // Apply filters if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    // Apply search if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    console.log('Query:', query);
    
    // Execute query with sorting
    const tasks = await Task.find(query).sort(sort);
    
    console.log(`Found ${tasks.length} tasks`);
    
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching tasks'
    });
  }
};


const getTask = async (req, res) => {
  try {
    console.log('=== GET SINGLE TASK ===');
    console.log('Task ID:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!task) {
      console.log('Task not found');
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    console.log('Task found:', task.title);
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching task'
    });
  }
};


const createTask = async (req, res) => {
  try {
    console.log('=== CREATE TASK ===');
    console.log('User:', req.user.id);
    console.log('Request body:', req.body);
    
    // Validate user is authenticated
    if (!req.user || !req.user.id) {
      console.error('No authenticated user');
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }
    
    // Sanitize and prepare task data
    const taskData = sanitizeTaskData(req.body, req.user.id);
    
    console.log('Sanitized task data:', taskData);
    
    // Validate required fields
    if (!taskData.title || taskData.title.trim() === '') {
      console.error('Title is missing');
      return res.status(400).json({
        success: false,
        error: 'Task title is required'
      });
    }
    
    console.log('Attempting to create task...');
    
    // Create the task
    const task = await Task.create(taskData);
    
    console.log('✅ Task created successfully:', task._id);
    
    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('❌ CREATE TASK ERROR:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle different error types
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${messages.join(', ')}`
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate task detected'
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: `Invalid ${error.path}: ${error.value}`
      });
    }
    
    // Handle "next is not a function" error
    if (error.message && error.message.includes('next is not a function')) {
      console.error('Middleware error detected. Checking task data...');
      return res.status(400).json({
        success: false,
        error: 'Invalid task data format. Please check all fields.'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while creating task'
    });
  }
};


// const updateTask = async (req, res) => {
//   try {
//     console.log('=== UPDATE TASK ===');
//     console.log('Task ID:', req.params.id);
//     console.log('User ID:', req.user.id);
//     console.log('Update data:', req.body);
    
//     // Find task belonging to user
//     const task = await Task.findOne({
//       _id: req.params.id,
//       user: req.user.id
//     });
    
//     if (!task) {
//       console.log('Task not found for update');
//       return res.status(404).json({
//         success: false,
//         error: 'Task not found'
//       });
//     }
    
//     console.log('Task found:', task.title);
    
//     // Define allowed updates
//     const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
//     let hasUpdates = false;
    
//     // Apply updates
//     allowedUpdates.forEach(field => {
//       if (req.body[field] !== undefined && req.body[field] !== task[field]) {
//         task[field] = req.body[field];
//         hasUpdates = true;
//         console.log(`Updating ${field}: ${task[field]}`);
//       }
//     });
    
//     if (!hasUpdates) {
//       console.log('No updates provided');
//       return res.status(400).json({
//         success: false,
//         error: 'No valid updates provided'
//       });
//     }
    
//     // Save the updated task
//     await task.save();
    
//     console.log('✅ Task updated successfully');
    
//     res.json({
//       success: true,
//       data: task
//     });
//   } catch (error) {
//     console.error('Update task error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Server error while updating task'
//     });
//   }
// };

const updateTask = async (req, res) => {
  try {
    console.log('=== UPDATE TASK DEBUG ===');
    console.log('Task ID:', req.params.id);
    console.log('User ID:', req.user.id);
    console.log('Update data:', req.body);
    console.log('Update data keys:', Object.keys(req.body));
    
    // ====== IMPORTANT FIX: Use findOneAndUpdate ======
    // This only validates fields that are being updated
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'dueDate'];
    const updates = {};
    let hasUpdates = false;
    
    // Build update object with only provided fields
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
        hasUpdates = true;
        console.log(`Will update ${field}:`, req.body[field]);
      }
    });
    
    if (!hasUpdates) {
      console.log('No updates provided');
      return res.status(400).json({
        success: false,
        error: 'No valid updates provided'
      });
    }
    
    // Add updatedAt timestamp
    updates.updatedAt = Date.now();
    
    console.log('Final updates object:', updates);
    
    // Use findOneAndUpdate with $set
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      { $set: updates },
      {
        new: true, // Return updated document
        runValidators: true, // Run validation on updated fields only
        context: 'query' // Important for proper validation
      }
    );
    
    if (!updatedTask) {
      console.log('Task not found for update');
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    console.log('✅ Task updated successfully:', updatedTask.title);
    
    res.json({
      success: true,
      data: updatedTask
    });
  } catch (error) {
    console.error('❌ Update task error:', error.message);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: `Validation error: ${messages.join(', ')}`
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: `Invalid ${error.path}: ${error.value}`
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error while updating task'
    });
  }
};


const deleteTask = async (req, res) => {
  try {
    console.log('=== DELETE TASK ===');
    console.log('Task ID:', req.params.id);
    console.log('User ID:', req.user.id);
    
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!task) {
      console.log('Task not found for deletion');
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    console.log('✅ Task deleted successfully:', task.title);
    
    res.json({
      success: true,
      data: {},
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting task'
    });
  }
};


const getTaskStats = async (req, res) => {
  try {
    console.log('=== GET TASK STATS ===');
    console.log('User ID:', req.user.id);
    
    // Get all tasks for the user
    const tasks = await Task.find({ user: req.user.id });
    
    // Calculate statistics
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'completed').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    
    
    const formattedStats = {
      total,
      completed,
      pending,
      'in-progress': inProgress, 
     
    };
    
    console.log('✅ Stats calculated:', formattedStats);
    
    res.json({
      success: true,
      data: formattedStats
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching task statistics'
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats
};