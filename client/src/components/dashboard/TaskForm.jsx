import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from '../common/Index';
import * as taskService from '../../Services/taskService';
import toast from 'react-hot-toast';

const TaskForm = ({ task, isOpen, onClose, onSuccess }) => {
  const isEdit = !!task;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  // Initialize form with task data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare payload
      // const payload = {
      //   title: formData.title,
      //   description: formData.description,
      //   status: formData.status,
      //   priority: formData.priority,
      //   dueDate: formData.dueDate ? `${formData.dueDate}T23:59:59.999Z` : null,
      //   // dueDate: formData.dueDate || null,
      // };

      const payload = {
  title: formData.title.trim(),
  description: formData.description.trim(),
  status: formData.status,
  priority: formData.priority,
};

// Handle dueDate correctly
if (formData.dueDate) {
  const date = new Date(formData.dueDate);
  if (!isNaN(date.getTime())) {
    // Set to end of day
    date.setHours(23, 59, 59, 999);
    payload.dueDate = date.toISOString();
  }
  // If date is invalid, don't include dueDate field
} else {
  payload.dueDate = null;
}

      let result;
      if (isEdit) {
        result = await taskService.updateTask(task._id, payload);
      } else {
        result = await taskService.createTask(payload);
      }

      if (result.success) {
        toast.success(isEdit ? 'Task updated successfully!' : 'Task created successfully!');
        onSuccess();
        onClose();
      } else {
        setError(result.error || `Failed to ${isEdit ? 'update' : 'create'} task`);
        toast.error(result.error || `Failed to ${isEdit ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.error('Task form error:', error);
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert 
            type="error" 
            message={error}
            onClose={() => setError('')}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task title"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter task description"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;