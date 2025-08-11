// src/pages/SharingPage.js
import React, { useState, useEffect } from 'react';
import { useBudgets } from '../hooks/useBudgets';
import { FaShareAlt } from 'react-icons/fa';
import Modal from '../components/Shared/Modal';
import CollaborationModal from '../components/Collaboration/CollaborationModal';
import Loading from '../components/Shared/Loading';

const SharingPage = () => {
  const { budgets, fetchBudgets, loading } = useBudgets();
  const [isSharingModalOpen, setIsSharingModalOpen] = useState(false);
  const [budgetToShare, setBudgetToShare] = useState(null);

  useEffect(() => {
    // Fetch the user's budgets when the component loads
    fetchBudgets();
  }, [fetchBudgets]);

  const handleShareBudget = (budget) => {
    setBudgetToShare(budget);
    setIsSharingModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsSharingModalOpen(false);
    setBudgetToShare(null);
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Budget Sharing</h1>
        <p className="mt-1 text-gray-600">
          Manage who has access to your budgets. Invite collaborators to view or edit.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Budgets</h2>
          <div className="space-y-4">
            {budgets.length > 0 ? (
              budgets.map((budget) => (
                <div key={budget.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="font-bold text-gray-900">{budget.name}</p>
                    <p className="text-sm text-gray-500">
                      Total Amount: ${Number(budget.amount).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleShareBudget(budget)}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <FaShareAlt className="mr-2" />
                    Manage Sharing
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">You haven't created any budgets yet. Create one to start sharing.</p>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isSharingModalOpen} onClose={handleCloseModal}>
        {budgetToShare && <CollaborationModal budget={budgetToShare} />}
      </Modal>
    </>
  );
};

export default SharingPage;
