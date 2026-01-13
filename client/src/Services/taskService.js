const API_URL = import.meta.env.REACT_APP_API_URL||'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to trigger dashboard update events
const triggerDashboardUpdate = (eventName) => {
  console.log(`Triggering event: ${eventName}`);
  window.dispatchEvent(new CustomEvent(eventName));
  
  // Also trigger a generic task change event for flexibility
  if (eventName !== 'task-changed') {
    window.dispatchEvent(new CustomEvent('task-changed'));
  }
};

// Get all tasks
export const getTasks = async (filters = {}) => {
  try {
    console.log('Fetching tasks with filters:', filters);
    
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.search) params.append('search', filters.search);
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);
    if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
    if (filters.sort) params.append('sort', filters.sort);
    
    const queryString = params.toString();
    const url = `${API_URL}/tasks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Tasks fetched:', data);
    return data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Get single task
export const getTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching task:', error);
    throw error;
  }
};

// Create task
export const createTask = async (taskData) => {
  try {
    console.log('Creating task:', taskData);
    
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Task created:', data);
    
    // ====== ADDED: Trigger dashboard update ======
    if (data.success) {
      triggerDashboardUpdate('task-created');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Update task
export const updateTask = async (id, taskData) => {
  try {
    console.log('Updating task:', id, taskData);
    
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Task updated:', data);
    
    // ====== ADDED: Trigger dashboard update ======
    if (data.success) {
      triggerDashboardUpdate('task-updated');
      
      // Special event for status changes
      if (taskData.status) {
        triggerDashboardUpdate('task-status-changed');
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    console.log('Deleting task:', id);
    
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Task deleted:', data);
    
   
    if (data.success) {
      triggerDashboardUpdate('task-deleted');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Get task statistics
export const getTaskStats = async () => {
  try {
    const response = await fetch(`${API_URL}/tasks/stats`, {
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching task stats:', error);
    throw error;
  }
};

export const testDashboardUpdate = () => {
  console.log('Testing dashboard update events...');
  triggerDashboardUpdate('task-created');
  return 'Test event triggered!';
};