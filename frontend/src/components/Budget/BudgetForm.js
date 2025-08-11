// src/components/Budget/BudgetForm.js
import React, { useState, useEffect } from 'react';
import CategoryPicker from './CategoryPicker';
import { useBudgets } from '../../hooks/useBudgets';

const BudgetForm = ({ budgetToEdit, onFormSubmit, onCancel }) => {
  const { addBudget, updateBudget, loading } = useBudgets();
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
  });
  const [error, setError] = useState('');

  const isEditing = !!budgetToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        name: budgetToEdit.name,
        amount: budgetToEdit.amount,
        category: budgetToEdit.category,
      });
    }
  }, [budgetToEdit, isEditing]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.amount || !formData.category) {
      return setError('All fields are required.');
    }
    try {
      const budgetData = { ...formData, amount: Number(formData.amount) };
      if (isEditing) {
        await updateBudget(budgetToEdit.id, budgetData);
      } else {
        await addBudget(budgetData);
      }
      onFormSubmit();
    } catch (err) {
      setError(err.message || 'Failed to save budget.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        {isEditing ? 'Edit Budget' : 'Create New Budget'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Budget Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} placeholder="e.g., Groceries, Transport"
            className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Total Amount ($)</label>
          <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 500"
            className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
        </div>
        <CategoryPicker selectedCategory={formData.category} onCategoryChange={handleCategoryChange} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300">
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Budget')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
