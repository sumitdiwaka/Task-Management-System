// import React, { useState, useEffect } from 'react';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import * as taskService from '../../services/taskService';
// import toast from 'react-hot-toast';

// const TaskForm = ({ task, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     priority: 'medium',
//     status: 'pending',
//     dueDate: '',
//     projectId: '',
//     assigneeId: '',
//     tags: []
//   });

//   // Initialize form with task data if editing
//   useEffect(() => {
//     if (task) {
//       console.log('Editing task:', task);
//       setFormData({
//         title: task.title || '',
//         description: task.description || '',
//         priority: task.priority || 'medium',
//         status: task.status || 'pending',
//         dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
//         projectId: task.projectId || '',
//         assigneeId: task.assigneeId || '',
//         tags: task.tags || []
//       });
//     } else {
//       console.log('Creating new task');
//       // Reset form for new task
//       setFormData({
//         title: '',
//         description: '',
//         priority: 'medium',
//         status: 'pending',
//         dueDate: '',
//         projectId: '',
//         assigneeId: '',
//         tags: []
//       });
//     }
//   }, [task]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     console.log(`Field ${name} changed to:`, value);
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('Submitting form data:', formData);
    
//     // Basic validation
//     if (!formData.title.trim()) {
//       toast.error('Title is required');
//       return;
//     }

//     setLoading(true);

//     try {
//       let result;
      
//       if (task) {
//         // Update existing task
//         console.log('Updating task:', task._id);
//         result = await taskService.updateTask(task._id, formData);
//       } else {
//         // Create new task
//         console.log('Creating new task');
//         result = await taskService.createTask(formData);
//       }

//       console.log('Task save result:', result);
      
//       if (result.success) {
//         toast.success(task ? 'Task updated successfully' : 'Task created successfully');
//         if (onSuccess) {
//           onSuccess();
//         }
//         if (onClose) {
//           onClose();
//         }
//       } else {
//         toast.error(result.error || `Failed to ${task ? 'update' : 'create'} task`);
//       }
//     } catch (error) {
//       console.error('Error saving task:', error);
//       toast.error(`Failed to ${task ? 'update' : 'create'} task. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-white" data-testid="task-form-modal">
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
//         <h3 className="text-lg font-medium text-gray-900">
//           {task ? 'Edit Task' : 'Create New Task'}
//         </h3>
//         <button
//           onClick={onClose}
//           className="text-gray-400 hover:text-gray-500 transition-colors"
//           disabled={loading}
//           data-testid="close-modal-btn"
//         >
//           <XMarkIcon className="h-6 w-6" />
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="px-6 py-4">
//         <div className="space-y-4">
//           {/* Title */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Title *
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter task title"
//               disabled={loading}
//               required
//               data-testid="task-title-input"
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               rows={3}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter task description"
//               disabled={loading}
//               data-testid="task-description-input"
//             />
//           </div>

//           {/* Priority and Status */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Priority */}
//             <div>
//               <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
//                 Priority
//               </label>
//               <select
//                 id="priority"
//                 name="priority"
//                 value={formData.priority}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 disabled={loading}
//                 data-testid="task-priority-select"
//               >
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//               </select>
//             </div>

//             {/* Status */}
//             <div>
//               <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
//                 Status
//               </label>
//               <select
//                 id="status"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 disabled={loading}
//                 data-testid="task-status-select"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="in-progress">In Progress</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//           </div>

//           {/* Due Date */}
//           <div>
//             <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
//               Due Date
//             </label>
//             <input
//               type="date"
//               id="dueDate"
//               name="dueDate"
//               value={formData.dueDate}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               disabled={loading}
//               data-testid="task-duedate-input"
//             />
//           </div>

//           {/* Project ID (optional) */}
//           <div>
//             <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
//               Project ID (optional)
//             </label>
//             <input
//               type="text"
//               id="projectId"
//               name="projectId"
//               value={formData.projectId}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter project ID"
//               disabled={loading}
//               data-testid="task-project-input"
//             />
//           </div>

//           {/* Assignee ID (optional) */}
//           <div>
//             <label htmlFor="assigneeId" className="block text-sm font-medium text-gray-700 mb-1">
//               Assignee ID (optional)
//             </label>
//             <input
//               type="text"
//               id="assigneeId"
//               name="assigneeId"
//               value={formData.assigneeId}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter assignee ID"
//               disabled={loading}
//               data-testid="task-assignee-input"
//             />
//           </div>
//         </div>

//         {/* Form Actions */}
//         <div className="mt-6 flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={onClose}
//             className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={loading}
//             data-testid="cancel-btn"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             disabled={loading}
//             data-testid="save-task-btn"
//           >
//             {loading ? (
//               <span className="flex items-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 Saving...
//               </span>
//             ) : (
//               task ? 'Update Task' : 'Create Task'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default TaskForm;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner, Alert } from '../common';
import * as taskService from '../../services/taskService';
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
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate || null,
      };

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