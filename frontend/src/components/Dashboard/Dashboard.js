// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Summary from './Summary';
import RecentActivity from './RecentActivity';
import ExpenseChart from '../Reports/ExpenseChart';
import * as reportAPI from '../../services/reportAPI';
import { useBudgets } from '../../hooks/useBudgets';

const Dashboard = () => {
  const { transactions } = useBudgets();
  const [summaryData, setSummaryData] = useState([]);
  const [loadingChart, setLoadingChart] = useState(true);
  const [activeDate, setActiveDate] = useState(new Date());

  // This effect sets the initial date for the chart.
  // It defaults to the month of the latest transaction, or the current month if no transactions exist.
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      // Create a copy before sorting to avoid mutating the original array
      const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
      setActiveDate(new Date(sortedTransactions[0].date));
    } else {
      setActiveDate(new Date());
    }
  }, [transactions]); // This will run only when the transactions array is first populated or changes.

  // This effect fetches chart data whenever the activeDate changes.
  useEffect(() => {
    const fetchChartData = async () => {
      setLoadingChart(true);
      try {
        const month = activeDate.getMonth() + 1;
        const year = activeDate.getFullYear();
        const data = await reportAPI.getSpendingSummary(month, year);
        setSummaryData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard chart data:", error);
        setSummaryData([]);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [activeDate]); // The dependency on `activeDate` makes the chart reactive

  // Handles changes from the month selector input
  const handleDateChange = (e) => {
    const [year, month] = e.target.value.split('-');
    // Set the date to the 15th of the month to avoid timezone-related issues
    setActiveDate(new Date(year, month - 1, 15));
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Here's a snapshot of your financial health.</p>
        </div>
        {/* Month Selector for the Chart */}
        <div>
            <label htmlFor="dashboard-month-select" className="sr-only">Select Month</label>
            <input
                id="dashboard-month-select"
                type="month"
                value={format(activeDate, 'yyyy-MM')}
                onChange={handleDateChange}
                className="mt-2 md:mt-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
            />
        </div>
      </div>
      
      <Summary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Spending Breakdown for {format(activeDate, 'MMMM yyyy')}
          </h3>
          <ExpenseChart data={summaryData} loading={loadingChart} />
        </div>

        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
