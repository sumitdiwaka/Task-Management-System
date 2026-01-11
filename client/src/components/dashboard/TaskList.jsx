// import React, { useState, useEffect, useRef } from 'react';
// import { PencilIcon, TrashIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
// import { Button, Badge, Spinner, Alert } from '../common';
// import * as taskService from '../../services/taskService';
// import { formatDate } from '../../utils/helpers';
// import TaskForm from './TaskForm';
// import toast from 'react-hot-toast';
// import Modal from '../common/Modal'; // Adjust path as needed

// const TaskList = ({ filters = {} }) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
  
//   // Add a ref to track if modal should open
//   const isOpeningModal = useRef(false);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       console.log('Fetching tasks with filters:', filters);
//       const result = await taskService.getTasks(filters);
      
//       if (result.success) {
//         console.log('Tasks fetched successfully:', result.data?.length || 0, 'tasks');
//         setTasks(result.data || []);
//       } else {
//         console.error('Failed to fetch tasks:', result.error);
//         setError(result.error || 'Failed to fetch tasks');
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       setError('Failed to load tasks. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [filters]);

//   const handleCreateTask = () => {
//     console.log('=== CREATE TASK CLICKED ===');
//     console.log('Current showForm state before:', showForm);
//     console.log('Setting selectedTask to null');
//     console.log('Setting showForm to true');
    
//     setSelectedTask(null);
//     setShowForm(true);
//     isOpeningModal.current = true;
    
//     console.log('State update scheduled...');
//   };

//   // Debug effect for modal state
//   useEffect(() => {
//     console.log('showForm state changed to:', showForm);
//     if (isOpeningModal.current && showForm) {
//       console.log('✅ Modal should be visible now!');
//       isOpeningModal.current = false;
      
//       // Check if modal element exists in DOM
//       setTimeout(() => {
//         const modal = document.querySelector('[data-testid="task-form-modal"]');
//         console.log('Modal element in DOM:', !!modal);
//         if (modal) {
//           console.log('Modal found! Checking visibility...');
//           console.log('Display style:', getComputedStyle(modal).display);
//           console.log('Parent visibility:', getComputedStyle(modal.parentElement).visibility);
//         } else {
//           console.log('❌ Modal not found in DOM!');
//           console.log('Checking all modal-like elements...');
//           const allModals = document.querySelectorAll('div[class*="modal"], div[style*="fixed"], div[style*="absolute"]');
//           console.log('Found elements:', allModals.length);
//         }
//       }, 100);
//     }
//   }, [showForm]);

//   const handleEdit = (task) => {
//     console.log('Edit task:', task._id);
//     setSelectedTask(task);
//     setShowForm(true);
//   };

//   const handleDelete = async (taskId) => {
//     try {
//       console.log('Deleting task:', taskId);
//       const result = await taskService.deleteTask(taskId);
      
//       if (result.success) {
//         toast.success('Task deleted successfully');
//         fetchTasks();
//         setDeleteConfirm(null);
//       } else {
//         toast.error(result.error || 'Failed to delete task');
//       }
//     } catch (error) {
//       toast.error('Failed to delete task. Please try again.');
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleStatusToggle = async (task) => {
//     try {
//       const newStatus = task.status === 'completed' ? 'pending' : 'completed';
//       const result = await taskService.updateTask(task._id, { status: newStatus });
      
//       if (result.success) {
//         toast.success(`Task marked as ${newStatus}`);
//         fetchTasks();
//       } else {
//         toast.error(result.error || 'Failed to update task');
//       }
//     } catch (error) {
//       toast.error('Failed to update task status');
//       console.error('Error updating task:', error);
//     }
//   };

//   const handleFormSuccess = () => {
//     console.log('Task form completed successfully');
//     setShowForm(false);
//     setSelectedTask(null);
//     fetchTasks();
//   };

//   const handleFormClose = () => {
//     console.log('Closing task form');
//     setShowForm(false);
//     setSelectedTask(null);
//   };

//   // Also add a keydown listener to close modal on Escape
//   useEffect(() => {
//     const handleEscape = (e) => {
//       if (e.key === 'Escape' && showForm) {
//         handleFormClose();
//       }
//     };
    
//     window.addEventListener('keydown', handleEscape);
//     return () => window.removeEventListener('keydown', handleEscape);
//   }, [showForm]);

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//         <Alert variant="error" title="Error loading tasks" message={error}>
//           <button
//             onClick={fetchTasks}
//             className="mt-2 font-medium text-red-600 hover:text-red-500"
//           >
//             Try again
//           </button>
//         </Alert>
//       </div>
//     );
//   }

//   if (tasks.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="mx-auto h-12 w-12 text-gray-400">
//           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//         </div>
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
//         <p className="mt-1 text-gray-500">
//           {Object.keys(filters).length > 0 
//             ? 'Try changing your filters' 
//             : 'Get started by creating your first task'}
//         </p>
//         <div className="mt-6">
//           <Button 
//             onClick={handleCreateTask} 
//             variant="primary"
//             data-testid="create-task-empty-state"
//           >
//             <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//             Create New Task
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">
//             Tasks <span className="text-gray-500">({tasks.length})</span>
//           </h2>
//           <p className="text-sm text-gray-500">Manage your tasks here</p>
//         </div>
        
//         <Button 
//           onClick={handleCreateTask} 
//           variant="primary"
//           data-testid="create-task-header"
//         >
//           <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//           New Task
//         </Button>
//       </div>

//       <div className="bg-white shadow overflow-hidden rounded-lg">
//         <ul className="divide-y divide-gray-200">
//           {tasks.map((task) => (
//             <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center flex-1 min-w-0">
//                   <button
//                     onClick={() => handleStatusToggle(task)}
//                     className={`mr-4 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
//                       task.status === 'completed'
//                         ? 'bg-green-500 border-green-500'
//                         : 'border-gray-300 hover:border-green-400'
//                     }`}
//                   >
//                     {task.status === 'completed' && (
//                       <CheckCircleIcon className="h-4 w-4 text-white" />
//                     )}
//                   </button>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center">
//                       <p className={`text-sm font-medium truncate ${
//                         task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
//                       }`}>
//                         {task.title}
//                       </p>
//                       <div className="ml-2 flex space-x-1">
//                         <Badge 
//                           variant={
//                             task.status === 'completed' ? 'success' :
//                             task.status === 'in-progress' ? 'primary' : 'default'
//                           }
//                           size="sm"
//                         >
//                           {task.status}
//                         </Badge>
//                         <Badge 
//                           variant={
//                             task.priority === 'high' ? 'danger' :
//                             task.priority === 'medium' ? 'warning' : 'default'
//                           }
//                           size="sm"
//                         >
//                           {task.priority}
//                         </Badge>
//                       </div>
//                     </div>
//                     <p className="text-sm text-gray-500 truncate">
//                       {task.description || 'No description'}
//                     </p>
//                     {task.dueDate && (
//                       <p className="text-xs text-gray-400 mt-1">
//                         Due: {formatDate(task.dueDate)}
//                       </p>
//                     )}
//                   </div>
//                 </div>
                
//                 <div className="ml-4 flex items-center space-x-2">
//                   <button
//                     onClick={() => handleEdit(task)}
//                     className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
//                     title="Edit task"
//                   >
//                     <PencilIcon className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => setDeleteConfirm(task._id)}
//                     className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
//                     title="Delete task"
//                   >
//                     <TrashIcon className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {deleteConfirm === task._id && (
//                 <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <div className="flex">
//                     <div className="flex-shrink-0">
//                       <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                       </svg>
//                     </div>
//                     <div className="ml-3">
//                       <h3 className="text-sm font-medium text-red-800">Delete Task</h3>
//                       <div className="mt-2 text-sm text-red-700">
//                         <p>Are you sure you want to delete "{task.title}"? This action cannot be undone.</p>
//                       </div>
//                       <div className="mt-4 flex space-x-3">
//                         <Button
//                           size="sm"
//                           variant="danger"
//                           onClick={() => handleDelete(task._id)}
//                         >
//                           Delete
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="secondary"
//                           onClick={() => setDeleteConfirm(null)}
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Task Form Modal - SIMPLIFIED VERSION FOR TESTING */}
//   <Modal
//   isOpen={showForm}
//   onClose={handleFormClose}
//   title={selectedTask ? "Edit Task" : "Create New Task"}
//   size="lg"
// >
//   <TaskForm
//     task={selectedTask}
//     onClose={handleFormClose}
//     onSuccess={handleFormSuccess}
//   />
// </Modal>
//     </div>
//   );
// };

// export default TaskList;


// import React, { useState, useEffect, useRef } from 'react';
// import { PencilIcon, TrashIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
// import { Button, Badge, Spinner } from '../common';
// import * as taskService from '../../services/taskService';
// import { formatDate } from '../../utils/helpers';
// import TaskForm from '../dashboard/TaskForm';
// import toast from 'react-hot-toast';
// import Modal from '../common/Modal';

// const TaskList = ({ filters = {} }) => {
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
  
//   // Use a ref to track modal opening
//   const isOpeningModal = useRef(false);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       setError('');
//       const result = await taskService.getTasks(filters);
      
//       if (result.success) {
//         console.log('Tasks fetched:', result);
//         setTasks(result.data || []);
//       } else {
//         setError(result.error || 'Failed to fetch tasks');
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       setError('Failed to load tasks. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, [filters]);

//   const handleCreateTask = () => {
//     console.log('=== CREATE TASK BUTTON CLICKED ===');
//     console.log('Current showForm:', showForm);
    
//     // Set the flag that we're opening modal
//     isOpeningModal.current = true;
    
//     // Update state
//     setSelectedTask(null);
//     setShowForm(true);
    
//     console.log('State updates scheduled...');
//   };

//   // Debug effect - runs when showForm changes
//   // useEffect(() => {
//   //   console.log('🔄 showForm state changed to:', showForm);
    
//   //   if (isOpeningModal.current && showForm) {
//   //     console.log('✅ Modal should be visible! showForm =', showForm);
//   //     console.log('Checking DOM for modal...');
      
//   //     // Check DOM after a brief delay
//   //     setTimeout(() => {
//   //       const modals = document.querySelectorAll('div');
//   //       let foundModal = false;
        
//   //       modals.forEach(div => {
//   //         const style = getComputedStyle(div);
//   //         if (style.position === 'fixed' || div.textContent?.includes('Modal') || div.textContent?.includes('modal')) {
//   //           console.log('Found potential modal div:', div);
//   //           console.log('Position:', style.position);
//   //           console.log('Z-index:', style.zIndex);
//   //           console.log('Display:', style.display);
//   //           console.log('Visibility:', style.visibility);
//   //           foundModal = true;
//   //         }
//   //       });
        
//   //       if (!foundModal) {
//   //         console.log('❌ No modal found in DOM!');
//   //         console.log('Total divs:', modals.length);
//   //       }
        
//   //       isOpeningModal.current = false;
//   //     }, 50);
//   //   }
//   // }, [showForm]);

//   const handleEdit = (task) => {
//     console.log('Edit task:', task._id);
//     setSelectedTask(task);
//     setShowForm(true);
//   };

//   const handleDelete = async (taskId) => {
//     try {
//       const result = await taskService.deleteTask(taskId);
      
//       if (result.success) {
//         toast.success('Task deleted successfully');
//         fetchTasks();
//         setDeleteConfirm(null);
//       } else {
//         toast.error(result.error || 'Failed to delete task');
//       }
//     } catch (error) {
//       toast.error('Failed to delete task. Please try again.');
//       console.error('Error deleting task:', error);
//     }
//   };

//   const handleStatusToggle = async (task) => {
//     try {
//       const newStatus = task.status === 'completed' ? 'pending' : 'completed';
//       const result = await taskService.updateTask(task._id, { status: newStatus });
      
//       if (result.success) {
//         toast.success(`Task marked as ${newStatus}`);
//         fetchTasks();
//       } else {
//         toast.error(result.error || 'Failed to update task');
//       }
//     } catch (error) {
//       toast.error('Failed to update task status');
//       console.error('Error updating task:', error);
//     }
//   };

//   const handleFormSuccess = () => {
//     console.log('Task form completed successfully');
//     setShowForm(false);
//     setSelectedTask(null);
//     fetchTasks();
//   };

//   const handleFormClose = () => {
//     console.log('Closing task form');
//     setShowForm(false);
//     setSelectedTask(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//         <div className="flex">
//           <div className="flex-shrink-0">
//             <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div className="ml-3">
//             <h3 className="text-sm font-medium text-red-800">Error loading tasks</h3>
//             <div className="mt-2 text-sm text-red-700">
//               <p>{error}</p>
//               <button
//                 onClick={fetchTasks}
//                 className="mt-2 font-medium text-red-600 hover:text-red-500"
//               >
//                 Try again
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (tasks.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <div className="mx-auto h-12 w-12 text-gray-400">
//           <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//           </svg>
//         </div>
//         <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
//         <p className="mt-1 text-gray-500">
//           {Object.keys(filters).length > 0 
//             ? 'Try changing your filters' 
//             : 'Get started by creating your first task'}
//         </p>
//         <div className="mt-6">
//           <Button 
//             onClick={handleCreateTask} 
//             variant="primary"
//           >
//             <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//             Create New Task
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               Tasks <span className="text-gray-500">({tasks.length})</span>
//             </h2>
//             <p className="text-sm text-gray-500">Manage your tasks here</p>
//           </div>
          
//           <Button 
//             onClick={handleCreateTask} 
//             variant="primary"
//           >
//             <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
//             New Task
//           </Button>
//         </div>

//         <div className="bg-white shadow overflow-hidden rounded-lg">
//           <ul className="divide-y divide-gray-200">
//             {tasks.map((task) => (
//               <li key={task._id} className="px-6 py-4 hover:bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center flex-1 min-w-0">
//                     <button
//                       onClick={() => handleStatusToggle(task)}
//                       className={`mr-4 flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${
//                         task.status === 'completed'
//                           ? 'bg-green-500 border-green-500'
//                           : 'border-gray-300 hover:border-green-400'
//                       }`}
//                     >
//                       {task.status === 'completed' && (
//                         <CheckCircleIcon className="h-4 w-4 text-white" />
//                       )}
//                     </button>
                    
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center">
//                         <p className={`text-sm font-medium truncate ${
//                           task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
//                         }`}>
//                           {task.title}
//                         </p>
//                         <div className="ml-2 flex space-x-1">
//                           <Badge 
//                             variant={
//                               task.status === 'completed' ? 'success' :
//                               task.status === 'in-progress' ? 'primary' : 'default'
//                             }
//                             size="sm"
//                           >
//                             {task.status}
//                           </Badge>
//                           <Badge 
//                             variant={
//                               task.priority === 'high' ? 'danger' :
//                               task.priority === 'medium' ? 'warning' : 'default'
//                             }
//                             size="sm"
//                           >
//                             {task.priority}
//                           </Badge>
//                         </div>
//                       </div>
//                       <p className="text-sm text-gray-500 truncate">
//                         {task.description || 'No description'}
//                       </p>
//                       {task.dueDate && (
//                         <p className="text-xs text-gray-400 mt-1">
//                           Due: {formatDate(task.dueDate)}
//                         </p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="ml-4 flex items-center space-x-2">
//                     <button
//                       onClick={() => handleEdit(task)}
//                       className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
//                       title="Edit task"
//                     >
//                       <PencilIcon className="h-4 w-4" />
//                     </button>
//                     <button
//                       onClick={() => setDeleteConfirm(task._id)}
//                       className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
//                       title="Delete task"
//                     >
//                       <TrashIcon className="h-4 w-4" />
//                     </button>
//                   </div>
//                 </div>

//                 {deleteConfirm === task._id && (
//                   <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="flex">
//                       <div className="flex-shrink-0">
//                         <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
//                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                         </svg>
//                       </div>
//                       <div className="ml-3">
//                         <h3 className="text-sm font-medium text-red-800">Delete Task</h3>
//                         <div className="mt-2 text-sm text-red-700">
//                           <p>Are you sure you want to delete "{task.title}"? This action cannot be undone.</p>
//                         </div>
//                         <div className="mt-4 flex space-x-3">
//                           <Button
//                             size="sm"
//                             variant="danger"
//                             onClick={() => handleDelete(task._id)}
//                           >
//                             Delete
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="secondary"
//                             onClick={() => setDeleteConfirm(null)}
//                           >
//                             Cancel
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>

    
      
//       {/* If you want to use your actual TaskForm later, add it here too */}
      
//       {/* {showForm && (
//         <div style={modalStyle}> */}
//        <TaskForm 
//         task={selectedTask} 
//         isOpen={showForm} 
//         onClose={handleFormClose} 
//         onSuccess={handleFormSuccess} 
//       />
//         {/* </div> */}
//       {/* // )} */}
     
//     </>
//   );
// };

// export default TaskList;


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