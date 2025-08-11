// src/components/Budget/BudgetList.js
import React, { useEffect } from 'react';
import BudgetCard from './BudgetCard';
import { PacmanLoader } from 'react-spinners';
import { useBudgets } from '../../hooks/useBudgets';

// The component now accepts an `onShareBudget` prop
const BudgetList = ({ onEditBudget, onShareBudget }) => {
  const { budgets, loading, error, fetchBudgets, deleteBudget } = useBudgets();

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
      await deleteBudget(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PacmanLoader color="#10B981" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">{error}</div>;
  }
  
  if (!budgets || budgets.length === 0) {
    return (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Budgets Found</h3>
            <p className="mt-2">Click "Add New Budget" to get started.</p>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onEdit={onEditBudget}
          onDelete={handleDelete}
          // FIX: Provide a fallback empty function for onShare.
          // This prevents the app from crashing if the onShareBudget prop is not passed down,
          // which is the cause of the "onShare is not a function" error.
          onShare={onShareBudget || (() => {})}
        />
      ))}
    </div>
  );
};

export default BudgetList;
