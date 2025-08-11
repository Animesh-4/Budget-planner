// src/components/Collaboration/InviteUsers.js
import React, { useState } from 'react';
import { useBudgets } from '../../hooks/useBudgets';

const InviteUser = ({ budgetId }) => {
  const { inviteUser } = useBudgets(); 
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback({ message: '', type: '' });

    if (!email) {
      setFeedback({ message: 'Email address is required.', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      await inviteUser(budgetId, email, role);
      setFeedback({ message: 'Invitation sent successfully!', type: 'success' });
      setEmail('');
      setRole('viewer');
    } catch (error) {
      // Safely extract error message for any type of thrown value
      let errorMessage = 'Failed to send invitation.';

      if (error?.response?.data?.message) {
        // Axios-style error with backend message
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        // Standard JS Error object
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        // Plain string thrown
        errorMessage = error;
      } else {
        // Last resort: stringify the object
        errorMessage = JSON.stringify(error);
      }

      setFeedback({ message: errorMessage, type: 'error' });
      console.error('InviteUser error:', error); // full object for debugging
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 mt-6 border-t">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Invite Collaborators</h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-grow">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            User&apos;s Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="editor">Editor</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300"
        >
          {loading ? 'Sending...' : 'Invite'}
        </button>
      </form>
      {feedback.message && (
        <p
          className={`mt-3 text-sm ${
            feedback.type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {feedback.message}
        </p>
      )}
    </div>
  );
};

export default InviteUser;
