import { format } from 'date-fns';

// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  try {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch {
    return 'Invalid date';
  }
};

// Format date for input field
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

// Get status badge color
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Get priority badge color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-orange-100 text-orange-800';
    case 'high':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};