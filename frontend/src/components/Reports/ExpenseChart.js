// src/components/Reports/ExpenseChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ExpenseChart = ({ data, loading }) => {
  // If the component is in a loading state, display a clear message.
  if (loading) {
    return (
        <div className="flex items-center justify-center h-full min-h-[350px]">
            <p className="text-gray-500">Loading Chart Data...</p>
        </div>
    );
  }
  
  // If loading is finished but there is no data, show a helpful "no data" message.
  if (!data || data.length === 0) {
    return (
        <div className="flex items-center justify-center h-full min-h-[350px]">
            <p className="text-gray-500">No expense data available for this period.</p>
        </div>
    );
  }

  // If data is present, render the chart inside a container with a defined height.
  // This is crucial for the ResponsiveContainer to work correctly.
  return (
    <div style={{ width: '100%', height: 350 }}> 
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 10,
            bottom: 50, // Increased bottom margin to prevent labels from being cut off
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="category_name" 
            angle={-45} // Angled labels are easier to read if there are many categories
            textAnchor="end" 
            interval={0} 
            height={60} 
          />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${Number(value).toFixed(2)}`}
            cursor={{ fill: 'rgba(240, 240, 240, 0.6)' }}
          />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '20px' }} />
          <Bar dataKey="total_spent" fill="#10B981" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
