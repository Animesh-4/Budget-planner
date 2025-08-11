// src/components/Reports/MonthlyReport.js
import React from 'react';
import { format } from 'date-fns';

const MonthlyReport = ({ data, loading }) => {
  if (loading) {
    return <div className="text-center p-4">Generating Report...</div>;
  }

  if (!data) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md flex items-center justify-center">
            <p className="text-gray-500">No report data available for this period.</p>
        </div>
    );
  }

  const reportMonth = data.month ? format(new Date(data.month), 'MMMM yyyy') : 'Current Month';

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Report for {reportMonth}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <tbody>
            <tr className="border-b">
              <td className="py-3 font-medium text-gray-600">Total Income</td>
              <td className="py-3 text-right font-semibold text-green-600">${Number(data.totalIncome).toFixed(2)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-3 font-medium text-gray-600">Total Expenses</td>
              <td className="py-3 text-right font-semibold text-red-600">${Number(data.totalExpenses).toFixed(2)}</td>
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="py-3 font-bold text-gray-800">Net Savings</td>
              <td className="py-3 text-right font-bold text-blue-600">${Number(data.netSavings).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-gray-800 mb-2">Top Spending Categories</h4>
        <ul className="space-y-2">
          {data.topCategories && data.topCategories.length > 0 ? (
            data.topCategories.map((item) => (
              <li key={item.category_name} className="flex justify-between p-2 bg-gray-100 rounded-md">
                <span>{item.category_name}</span>
                <span className="font-medium">${Number(item.amount).toFixed(2)}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No expenses recorded for this month.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MonthlyReport;
