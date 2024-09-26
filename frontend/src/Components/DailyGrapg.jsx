import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const DailyExpenseGraph = ({ dailyExpenses }) => {
  const labels = dailyExpenses.map(entry => entry.date); 
  const data = dailyExpenses.map(entry => entry.amount); 

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Daily Expenses',
        data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Daily Expense Graph</h2>
      <Line data={chartData} options={{ responsive: true }} />
    </div>
  );
};

export default DailyExpenseGraph;
