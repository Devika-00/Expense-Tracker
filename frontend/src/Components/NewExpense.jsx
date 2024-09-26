import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar'; 
import axios from 'axios';
import { useSelector } from 'react-redux'; 
import { SERVER_URL } from '../Constants'; 
import showToast from '../Utils/ShowToast';
import Navbar from '../Components/Navbar'; 

const AddExpense = () => {
  const userId = useSelector((state) => state.user.id); 
  const [categories, setCategories] = useState([]); 
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/budget/${userId}`);
        const categoryList = response.data.map(budget => ({
          id: budget._id,
          name: budget.category
        })); 
        setCategories(categoryList); 
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (userId) { 
      fetchCategories();
    }
  }, [userId]); 

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
  
    const updatedBudget = {
      amount: parseFloat(amount),
      categoryId: selectedCategory,
    };
  
    const newExpense = {
      amount: parseFloat(amount),
      category: categories.find(cat => cat.id === selectedCategory)?.name,
      date: date,
      description: description,
      userId 
    };

    try {
      await axios.put(`${SERVER_URL}/budget/${selectedCategory}`, updatedBudget);
      await axios.post(`${SERVER_URL}/expense`, newExpense);
      setAmount('');
      setSelectedCategory('');
      setDate('');
      setDescription('');
      showToast("Expense Updated and Added", "success");
    } catch (error) {
      console.error('Error updating budget amount or adding expense:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* Add Navbar at the top */}
      <div className="flex flex-grow">
        <Sidebar /> {/* Sidebar */}
        <div className="flex-grow bg-gray-100 p-6 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-5">Update Used Expenses</h2>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                ></textarea>
              </div>
              <button className="bg-blue-900 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600">
                Add Expense
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpense;
