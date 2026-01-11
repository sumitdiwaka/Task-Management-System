import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button, Badge, Spinner } from '../common';
import * as taskService from '../../services/taskService';
import { formatDate } from '../../utils/helpers';
import TaskForm from '../dashboard/TaskForm';
import toast from 'react-hot-toast';

const TaskList = ({ filters = {} }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await taskService.getTasks(filters);
      if (result.success) {
        setTasks(result.data || []);
      } else {
        setError(result.error || 'Failed to fetch tasks');
      }
    } catch (error) {
      setError('Failed to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      const result = await taskService.deleteTask(taskId);
      if (result.success) {
        toast.success('Task deleted successfully');
        fetchTasks();
        setDeleteConfirm(null);
      }
    } catch (error) {
      toast.error('Failed to delete task.');
    }
  };

  const handleStatusToggle = async (task) => {
    try {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const result = await taskService.updateTask(task._id, { status: newStatus });
      if (result.success) {
        toast.success(`Task marked as ${newStatus}`);
        fetchTasks();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedTask(null);
    fetchTasks();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Tasks <span className="text-gray-500">({tasks.length})</span>
            </h2>
            <p className="text-sm text-gray-500">Manage your tasks here</p>
          </div>
          <Button onClick={handleCreateTask} variant="primary">
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" /> New Task
          </Button>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <button
                      onClick={() => handleStatusToggle(task)}
                      className={`mr-4 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                        task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircleIcon className="h-4 w-4 text-white" />}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-2">
                    <button onClick={() => handleEdit(task)} className="p-2 text-gray-400 hover:text-blue-600"><PencilIcon className="h-4 w-4" /></button>
                    <button onClick={() => setDeleteConfirm(task._id)} className="p-2 text-gray-400 hover:text-red-600"><TrashIcon className="h-4 w-4" /></button>
                  </div>
                </div>

                {deleteConfirm === task._id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">Are you sure you want to delete "{task.title}"?</p>
                    <div className="mt-4 flex space-x-3">
                      <Button size="sm" variant="danger" onClick={() => handleDelete(task._id)}>Delete</Button>
                      <Button size="sm" variant="secondary" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <TaskForm 
        task={selectedTask} 
        isOpen={showForm} 
        onClose={handleFormClose} 
        onSuccess={handleFormSuccess} 
      />
    </>
  );
};

export default TaskList;