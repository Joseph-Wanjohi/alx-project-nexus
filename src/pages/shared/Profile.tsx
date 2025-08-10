import React, { useState, useEffect } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../../api/userApi';
import { useAuth } from '../../context/authContext';
import type { User } from '../../types/UsersTypes';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { isAuthenticated } = useAuth();
  const { data: user, isLoading, error } = useGetUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateUser] = useUpdateUserMutation();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User>({
    id: 0,
    username: '',
    email: '',
    roles: '',
    is_active: false,
    date_joined: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData).unwrap();
      setEditMode(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50 text-center">
            <h2 className="text-3xl font-display font-extrabold text-charcoal mb-6">Access Denied</h2>
            <p className="text-charcoal/60 mb-8">Please log in to view your profile.</p>
            <Link
              to="/login"
              className="inline-block bg-gradient-to-r from-jordy-blue to-light-sky-blue text-warm-white px-6 py-3 rounded-lg hover:from-jordy-blue/90 hover:to-light-sky-blue/90 focus:ring-2 focus:ring-jordy-blue/50 transition-all duration-300 transform hover:scale-105 shadow-medium"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-t-4 border-jordy-blue border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-deep-sky-blue font-display font-semibold">
              Loading...
            </div>
          </div>
          <p className="mt-4 text-charcoal/60">Fetching your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50 text-center">
            <h2 className="text-2xl font-display font-bold text-amber-yellow mb-4">Error</h2>
            <p className="text-charcoal/60 mb-6">Failed to load profile: {error.toString()}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-yellow to-sunset-orange text-warm-white px-6 py-3 rounded-lg hover:from-sunset-orange hover:to-amber-yellow focus:ring-2 focus:ring-amber-yellow/50 transition-all duration-300 transform hover:scale-105 shadow-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-4">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-extrabold text-charcoal mb-8 text-center animate-fade-in">
          Your Profile
        </h1>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
          {successMessage && (
            <div className="mb-6 p-4 bg-forest-green/10 border border-forest-green/20 rounded-lg text-center">
              <p className="text-forest-green text-sm">{successMessage}</p>
            </div>
          )}
          {!editMode ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-display font-bold text-charcoal">Profile Details</h2>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-jordy-blue to-light-sky-blue text-warm-white px-4 py-2 rounded-lg hover:from-jordy-blue/90 hover:to-light-sky-blue/90 focus:ring-2 focus:ring-jordy-blue/50 transition-all duration-300 transform hover:scale-105 shadow-medium"
                >
                  Edit Profile
                </button>
              </div>
              {user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-charcoal/60">Username</p>
                    <p className="text-charcoal font-medium">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal/60">Email</p>
                    <p className="text-charcoal font-medium">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal/60">Role</p>
                    <p className="text-charcoal font-medium">{user.roles}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal/60">Status</p>
                    <p className="text-charcoal font-medium">{user.is_active ? 'Active' : 'Inactive'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-charcoal/60">Joined</p>
                    <p className="text-charcoal font-medium">{new Date(user.date_joined).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-charcoal mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                />
              </div>
              <div>
                <label htmlFor="roles" className="block text-sm font-medium text-charcoal mb-2">
                  Role
                </label>
                <input
                  type="text"
                  id="roles"
                  name="roles"
                  value={formData.roles}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-jordy-blue focus:border-jordy-blue transition-colors"
                  disabled
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-4 h-4 text-jordy-blue focus:ring-jordy-blue border-gray-300 mr-2"
                  disabled
                />
                <label htmlFor="is_active" className="text-sm text-charcoal">
                  Active
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-jordy-blue to-light-sky-blue text-warm-white px-6 py-3 rounded-lg hover:from-jordy-blue/90 hover:to-light-sky-blue/90 focus:ring-2 focus:ring-jordy-blue/50 transition-all duration-300 transform hover:scale-105 shadow-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="mt-4 w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 focus:ring-2 focus:ring-red-500/50 transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;