// src/components/Collaboration/UserList.js
import React, { useEffect } from 'react';
import { useBudgets } from '../../hooks/useBudgets';
import { useAuth } from '../../hooks/useAuth';
import { FaCrown, FaTrash } from 'react-icons/fa';

const UserList = ({ budgetId }) => {
  const { collaborators, fetchCollaborators, removeCollaborator } = useBudgets();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (budgetId) {
      fetchCollaborators(budgetId);
    }
  }, [budgetId, fetchCollaborators]);

  const handleRemove = (userId) => {
    if (window.confirm('Are you sure you want to remove this user from the budget?')) {
      removeCollaborator(budgetId, userId);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-800">Shared With</h3>
      <ul className="space-y-3">
        {/* FIX: Add a check to ensure collaborators is an array before mapping. */}
        {/* This prevents the component from crashing if the data hasn't loaded yet. */}
        {Array.isArray(collaborators) && collaborators.map((user) => (
          <li key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="font-medium text-gray-900">{user.username} {user.role === 'owner' && <FaCrown className="inline mb-1 ml-1 text-yellow-500" title="Owner"/>}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            {currentUser.id !== user.id && user.role !== 'owner' ? (
                <button onClick={() => handleRemove(user.id)} className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600" aria-label="Remove user">
                    <FaTrash />
                </button>
            ) : (
                <span className="px-3 py-1 text-sm font-medium text-gray-700 capitalize bg-gray-200 rounded-full">{user.role}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
