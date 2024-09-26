import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import DailyExpenseGraph from './DailyGrapg'; 
import { SERVER_URL } from '../Constants';

const GraphPage = () => {
  const userId = useSelector((state) => state.user.id);
  const [dailyExpenses, setDailyExpenses] = useState([]);

  useEffect(() => {
    const fetchDailyExpenses = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/expenses/daily/${userId}`);
        setDailyExpenses(response.data);
      } catch (error) {
        console.error('Error fetching daily expenses:', error);
      }
    };

    if (userId) {
      fetchDailyExpenses();
    }
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-grow p-4 sm:p-6 lg:p-8">
          <div className="bg-white p-4 rounded-lg shadow h-full">
            <DailyExpenseGraph dailyExpenses={dailyExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
