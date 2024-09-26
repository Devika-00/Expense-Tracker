
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import axios from 'axios';
import { SERVER_URL } from '../Constants';
import Navbar from './Navbar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import EditBudgetModal from './EditBudgetModal';

const Dashboard = () => {
  const userId = useSelector((state) => state.user.id);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [budgets, setBudgets] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetToEdit, setBudgetToEdit] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/budget/${userId}`);
        setBudgets(response.data);
        calculateTotalMoney(response.data);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    if (userId) {
      fetchBudgets();
    }
  }, [userId]);

  const calculateTotalMoney = (budgets) => {
    const totalIncome = budgets.reduce((acc, budget) => acc + budget.amount, 0);
    setMonthlyIncome(totalIncome);

    const totalUsed = budgets.reduce((acc, budget) => acc + (budget.amountUsed || 0), 0);
    setMonthlyExpenses(totalUsed);

    const remainingBudget = totalIncome - totalUsed;

    // Check if remaining budget is less than $500
    if (remainingBudget < 500) {
      setWarningMessage('Warning: You are nearing your budget limit. Remaining budget is less than $500.');
    } else {
      setWarningMessage(''); // Clear message if above limit
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();

    const month = new Date().toISOString().slice(0, 7);
    const newBudget = {
      userId,
      category,
      amount: parseFloat(amount),
      month,
      amountUsed: 0,
    };

    try {
      const response = await axios.post(`${SERVER_URL}/budget`, newBudget);
      setBudgets((prevBudgets) => [...prevBudgets, response.data]);
      calculateTotalMoney([...budgets, response.data]);
      setCategory('');
      setAmount('');
    } catch (error) {
      console.error('Error adding budget:', error);
    }
  };

  const handleEditBudget = (budget) => {
    setBudgetToEdit(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (budgetId) => {
    try {
      await axios.delete(`${SERVER_URL}/budget/${budgetId}`);
      const updatedBudgets = budgets.filter(budget => budget._id !== budgetId);
      setBudgets(updatedBudgets);
      calculateTotalMoney(updatedBudgets);
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleUpdateBudget = async (updatedBudget) => {
    try {
      await axios.put(`${SERVER_URL}/budgetDetails/${updatedBudget._id}`, updatedBudget);
      const updatedBudgets = budgets.map(budget =>
        budget._id === updatedBudget._id ? updatedBudget : budget
      );
      setBudgets(updatedBudgets);
      calculateTotalMoney(updatedBudgets);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow p-6 overflow-y-auto">
          {/* Warning Message */}
          {warningMessage && (
            <div className="bg-red-100 p-4 rounded-lg mb-4 text-red-800">
              {warningMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold">Total Amount</h3>
              <p className="text-2xl font-bold">${monthlyIncome}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold">Amount Used</h3>
              <p className="text-2xl font-bold">${monthlyExpenses}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <h3 className="text-xl font-semibold">Remaining Budget</h3>
              <p className="text-2xl font-bold">${monthlyIncome - monthlyExpenses}</p>
            </div>
          </div>

          {/* Budget Form */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Set Monthly Budget</h2>
            <form onSubmit={handleBudgetSubmit} className="flex flex-col md:flex-row mb-4">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category"
                required
                className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-grow"
              />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
                className="border p-2 rounded mb-2 md:mb-0 md:mr-2 flex-grow"
              />
              <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                Set Budget
              </button>
            </form>
          </div>

          {/* Display Current Budgets in a Table */}
          {budgets.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow mt-4 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Current Budgets</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-medium font-bold text-blue-950 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-medium font-bold text-blue-950 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-medium font-bold text-blue-950 uppercase tracking-wider">Amount Used</th>
                    <th className="px-6 py-3 text-left text-medium font-bold text-blue-950 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-medium font-bold text-blue-950 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {budgets.map((budget) => (
                    <tr key={budget._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-800">{budget.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-800">${budget.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-800">${budget.amountUsed || 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-800">{budget.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-medium text-gray-800 flex space-x-2">
                        <button onClick={() => handleEditBudget(budget)} className="text-blue-500 hover:underline">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteBudget(budget._id)} className="text-red-500 hover:underline">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Budget Modal */}
          {isModalOpen && (
            <EditBudgetModal 
              budget={budgetToEdit} 
              onClose={() => setIsModalOpen(false)} 
              onUpdate={handleUpdateBudget} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
