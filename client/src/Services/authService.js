const API_URL = 'http://localhost:5000/api';

// Register user
export const register = async (userData) => {
  try {
    console.log('Register attempt to:', `${API_URL}/auth/register`);
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log('Register response:', data);

    if (data.success) {
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('User saved to localStorage');
    }

    return data;
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: 'Network error. Please check if server is running.'
    };
  }
};

// Login user
export const login = async (userData) => {
  try {
    console.log('Login attempt to:', `${API_URL}/auth/login`);
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log('Login response:', data);

    if (data.success) {
      // Save token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('Login successful, user saved to localStorage');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'Cannot connect to server. Please check if backend is running on port 5000.'
    };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('User logged out');
};

// Get user profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

export const updatePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/auth/password`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    const data = await response.json();
    console.log('Update password response:', data);

    if (data.success && data.token) {
      // Update token in localStorage
      localStorage.setItem('token', data.token);
      console.log('Token updated after password change');
    }

    return data;
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: 'Failed to update password'
    };
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Get auth token
export const getToken = () => {
  return localStorage.getItem('token');
};