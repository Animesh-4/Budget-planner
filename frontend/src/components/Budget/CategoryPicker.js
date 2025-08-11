// src/components/Budget/CategoryPicker.js
import React from 'react';

// Mock hook for standalone development
const useBudgets = () => ({
  categories: ['Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Health', 'Other'],
});

const CategoryPicker = ({ selectedCategory, onCategoryChange }) => {
  const { categories } = useBudgets(); // Replace with actual useBudgets() hook

  return (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
        Category
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={onCategoryChange}
        className="block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryPicker;