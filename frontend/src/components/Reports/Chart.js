// src/components/Reports/Charts.js
import React, { useState, useEffect } from 'react';
import ExpenseChart from './ExpenseChart';
import MonthlyReport from './MonthlyReport';
import * as reportAPI from '../../services/reportAPI';
import { useBudgets } from '../../hooks/useBudgets';

const Charts = () => {
  const { transactions } = useBudgets();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [summaryData, setSummaryData] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError('');
      try {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();

        const [summary, report] = await Promise.all([
          reportAPI.getSpendingSummary(month, year),
          reportAPI.getMonthlyReport(month, year)
        ]);
        
        setSummaryData(summary);
        setReportData(report);
      } catch (err) {
        setError('Failed to load report data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [currentDate, transactions]);

  const handleDateChange = (e) => {
    const [year, month] = e.target.value.split('-');
    setCurrentDate(new Date(year, month - 1, 15));
  };

  // A check to see if there is any data to display for the selected period
  const hasData = !loading && (summaryData.length > 0 || (reportData && (reportData.totalIncome > 0 || reportData.totalExpenses > 0)));

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-1">Visualize your spending and track your progress.</p>
        </div>
        <div>
          <label htmlFor="month-select" className="sr-only">Select Month</label>
          <input
            id="month-select"
            type="month"
            value={currentDate.toISOString().slice(0, 7)}
            onChange={handleDateChange}
            className="mt-2 md:mt-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {error && <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">{error}</div>}
      
      {loading ? (
        <div className="text-center text-gray-500">Loading reports...</div>
      ) : hasData ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <ExpenseChart data={summaryData} loading={loading} />
          </div>
          <div className="lg:col-span-2">
            <MonthlyReport data={reportData} loading={loading} />
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Data for this Period</h3>
            <p className="mt-2">There are no transactions recorded for the selected month.</p>
        </div>
      )}
    </div>
  );
};

export default Charts;
