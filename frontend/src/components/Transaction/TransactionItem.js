// src/components/Transaction/TransactionItem.js
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Using react-icons for iconography

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { description, amount, type, category, date } = transaction;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const amountColor = type === 'income' ? 'text-green-600' : 'text-red-600';
  const amountSign = type === 'income' ? '+' : '-';

  return (
    <tr className="bg-white hover:bg-gray-50 border-b">
      <td className="p-4 font-medium text-gray-900">{description}</td>
      <td className={`p-4 font-semibold ${amountColor}`}>
        {amountSign} ${Math.abs(amount).toFixed(2)}
      </td>
      <td className="p-4 text-gray-600">{category}</td>
      <td className="p-4 text-gray-600">{formattedDate}</td>
      <td className="p-4 text-right">
        <button
          onClick={() => onEdit(transaction)}
          className="mr-4 text-blue-600 hover:text-blue-800"
          aria-label="Edit transaction"
        >
          <FaEdit />
        </button>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-red-600 hover:text-red-800"
          aria-label="Delete transaction"
        >
          <FaTrash />
        </button>
      </td>
    </tr>
  );
};

export default TransactionItem;