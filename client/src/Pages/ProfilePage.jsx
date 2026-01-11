import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout';
import { Button, Input, Alert, Spinner } from '../components/common';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, updatePassword, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: ''
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await updateProfile(profileForm);
      
      if (result.success) {
        toast.success('Profile updated successfully!');
        setErrors({});
      } else {
        toast.error(result.error || 'Failed to update profile');
        setErrors({ general: result.error });
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await updatePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      if (result.success) {
        toast.success('Password updated successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      } else {
        toast.error(result.error || 'Failed to update password');
        setErrors({ general: result.error });
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account information and security</p>
        </div>

        <div className="flex space-x-1 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'profile'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'password'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Change Password
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
              activeTab === 'security'
                ? 'bg-white border-t border-l border-r border-gray-200 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Security
          </button>
        </div>

        {/* Profile Information Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            {errors.general && (
              <Alert type="error" message={errors.general} className="mb-6" />
            )}

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-500">
                    Member since: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileChange}
                error={errors.name}
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                error={errors.email}
                required
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
            
            {errors.general && (
              <Alert type="error" message={errors.general} className="mb-6" />
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                error={errors.currentPassword}
                required
              />

              <Input
                label="New Password"
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                error={errors.newPassword}
                required
                helpText="Must be at least 6 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                error={errors.confirmPassword}
                required
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
            
            <div className="space-y-6">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Account Activity</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Last login: {new Date().toLocaleString()}
                </p>
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  View login history
                </button>
              </div>

              <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">Delete Account</p>
                    <p className="text-sm text-gray-600">Permanently remove your account and all data</p>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        toast.error('Account deletion not implemented in demo');
                      }
                    }}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="secondary"
                  onClick={logout}
                  className="w-full"
                >
                  Logout from all devices
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;