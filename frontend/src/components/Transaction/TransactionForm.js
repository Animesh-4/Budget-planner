// src/components/Transaction/TransactionForm.js
import React, { useState, useEffect } from 'react';
import CategoryPicker from '../Budget/CategoryPicker';
import { useBudgets } from '../../hooks/useBudgets';

const TransactionForm = ({ transactionToEdit, onFormSubmit, onCancel }) => {
  const { addTransaction, updateTransaction, loading } = useBudgets();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [error, setError] = useState('');

  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        description: transactionToEdit.description,
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        category: transactionToEdit.category_name, // Use category_name for display
        date: new Date(transactionToEdit.date).toISOString().split('T')[0],
      });
    }
  }, [transactionToEdit, isEditing]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => setFormData({ ...formData, category: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.description || !formData.amount || !formData.category || !formData.date) {
      return setError('All fields are required.');
    }
    try {
      const transactionData = { ...formData, amount: Number(formData.amount) };
      if (isEditing) {
        await updateTransaction(transactionToEdit.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }
      onFormSubmit();
    } catch (err) {
      setError(err.message || 'Failed to save transaction.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields remain the same */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} placeholder="e.g., Coffee, Paycheck"
            className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount ($)</label>
                <input type="number" name="amount" id="amount" value={formData.amount} onChange={handleChange} placeholder="e.g., 4.50"
                    className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type" id="type" value={formData.type} onChange={handleChange} className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>
        </div>
        <CategoryPicker selectedCategory={formData.category} onCategoryChange={handleCategoryChange} />
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange}
                className="block w-full px-3 py-2 mt-1 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end pt-4 space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300">
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Transaction')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
