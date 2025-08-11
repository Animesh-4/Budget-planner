// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import Button from '../components/Shared/Button';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Shared/Loading';

const ProfilePage = () => {
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Use 'username' as that is what the backend provides
      setFormData({ name: user.username || '' });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    try {
      await updateProfile(user.id, { username: formData.name });
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error("Failed to update profile:", error);
      // You could set an error message here
    } finally {
      setLoading(false);
    }
  };
  
  if (authLoading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      <div className="max-w-2xl">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={user?.email || ''}
                disabled // Email is not editable
                className="block w-full px-3 py-2 mt-1 bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>
            
            {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
            )}

            <div className="pt-2 text-right">
              <Button type="submit" loading={loading} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
