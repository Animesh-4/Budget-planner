// src/components/Dashboard/RecentActivity.js
import React from 'react';
import { useBudgets } from '../../hooks/useBudgets';

const RecentActivity = () => {
  const { transactions, loading } = useBudgets();

  // FIX: Default to an empty array if transactions is not yet available.
  // This prevents the .slice() method from being called on an undefined value.
  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 4) : [];

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
      {loading && recentTransactions.length === 0 ? (
        <p className="text-gray-500">Loading activity...</p>
      ) : (
        <ul className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{tx.description}</p>
                  <p className="text-sm text-gray-500">{tx.category_name || 'General'}</p>
                </div>
                <p className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'income' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                </p>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No recent transactions to display.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
