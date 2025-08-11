// src/components/Collaboration/CollaborationModal.js
import React from 'react';
import UserList from './UserList';
import InviteUsers from './InviteUser';

const CollaborationModal = ({ budget }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Share "{budget.name}"
        </h2>
        <UserList budgetId={budget.id} />
        <InviteUsers budgetId={budget.id} />
    </div>
  );
};

export default CollaborationModal;
