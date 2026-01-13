const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  // title: {
  //   type: String,
  //   required: [true, 'Please provide a task title'],
  //   trim: true,
  //   maxlength: [100, 'Title cannot be more than 100 characters']
  // },

    title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

TaskSchema.pre('save', function(next) {
  // Only validate required fields on NEW documents (creation)
  if (this.isNew) {
    if (!this.title || this.title.trim() === '') {
      next(new Error('Task title is required'));
      return;
    }
  }
  
  // Update the updatedAt timestamp
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  
  next();
});


module.exports = mongoose.model('Task', TaskSchema);