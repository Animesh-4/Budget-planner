// src/components/Budget/BudgetCard.js
import React from 'react';
import { FaShareAlt } from 'react-icons/fa';

const BudgetCard = ({ budget, onEdit, onDelete, onShare }) => {
  // Provide default values to prevent crashes if data is missing or malformed
  const { name, category } = budget;
  const amount = Number(budget.amount) || 0;
  const spent = Number(budget.spent) || 0;
  
  const spentPercentage = amount > 0 ? (spent / amount) * 100 : 0;

  const getProgressBarColor = () => {
    if (spentPercentage >= 90) return 'bg-red-500';
    if (spentPercentage >= 75) return 'bg-yellow-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate" title={name}>{name}</h3>
          <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full flex-shrink-0">
            {category || 'General'}
          </span>
        </div>
        
        <div className="my-4">
          <div className="flex justify-between mb-1 text-sm font-medium text-gray-600">
            {/* Use toFixed to ensure two decimal places are always shown */}
            <span>${spent.toFixed(2)}</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressBarColor()}`}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-2 border-t mt-4">
        <button
          onClick={() => onShare(budget)}
          className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600"
        >
          <FaShareAlt className="mr-1" />
          Share
        </button>
        <button onClick={() => onEdit(budget)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
          Edit
        </button>
        <button onClick={() => onDelete(budget.id)} className="text-sm font-medium text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>
    </div>
  );
};

export default BudgetCard;
