import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../Services/authService';
import toast from 'react-hot-toast';
const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check initial authentication state
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getCurrentUser();
        
        console.log('Initial auth check:', { token: !!token, user: !!storedUser });
        
        if (token && storedUser) {
          setUser(storedUser);
          console.log('User loaded from localStorage:', storedUser);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      console.log('Attempting login with:', email);
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      if (response.success) {
        const user = authService.getCurrentUser();
        setUser(user);
        console.log('Login successful, user set:', user);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.register({ name, email, password });
      
      if (response.success) {
        const user = authService.getCurrentUser();
        setUser(user);
        return { success: true };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMsg = error.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
  try {
    setLoading(true);
    setError(null);
    
    // In a real app, you would call an API here
    // For now, update localStorage and state
    const updatedUser = {
      ...user,
      ...userData
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    toast.success('Profile updated successfully');
    return { success: true };
  } catch (error) {
    console.error('Update profile error:', error);
    setError('Failed to update profile');
    return { success: false, error: 'Failed to update profile' };
  } finally {
    setLoading(false);
  }
};

const updatePassword = async (currentPassword, newPassword) => {
  try {
    setLoading(true);
    setError(null);
    
    // Call the actual API
    const response = await authService.updatePassword({
      currentPassword,
      newPassword
    });
    
    console.log('Update password response:', response);
    
    if (response.success) {
      toast.success('Password updated successfully!');
      
      // If new token is returned, update it
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      return { success: true };
    } else {
      toast.error(response.error || 'Failed to update password');
      setError(response.error);
      return { success: false, error: response.error };
    }
  } catch (error) {
    console.error('Update password error:', error);
    const errorMsg = error.message || 'Failed to update password';
    toast.error(errorMsg);
    setError(errorMsg);
    return { success: false, error: errorMsg };
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
    console.log('User logged out from context');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};