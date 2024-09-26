import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../Constants';

const EditBudgetModal = ({ budget, onClose, onUpdate }) => {
  const [category, setCategory] = useState(budget.category);
  const [amount, setAmount] = useState(budget.amount);
  const [amountUsed, setAmountUsed] = useState(budget.amountUsed);
  const [date, setDate] = useState(budget.date);

  useEffect(() => {
    if (budget) {
      setCategory(budget.category);
      setAmount(budget.amount);
      setAmountUsed(budget.amountUsed);
      setDate(budget.month); 
    }
  }, [budget]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedBudget = {
      ...budget,
      category,
      amount: parseFloat(amount),
      amountUsed: parseFloat(amountUsed),
      month: date,
    };

    onUpdate(updatedBudget);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Edit Budget</h2>
        <form onSubmit={handleUpdate} className="flex flex-col">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            required
            className="border p-2 rounded mb-4 w-full"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className="border p-2 rounded mb-4 w-full"
          />
          <input
            type="number"
            value={amountUsed}
            onChange={(e) => setAmountUsed(e.target.value)}
            placeholder="Amount Used"
            required
            className="border p-2 rounded mb-4 w-full"
          />
          <input
            type="month"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Month"
            required
            className="border p-2 rounded mb-4 w-full"
          />
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full mr-2">
              Update Budget
            </button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white p-2 rounded w-full ml-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetModal;
