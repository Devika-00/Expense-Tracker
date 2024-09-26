import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; 
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { SERVER_URL } from "../Constants";
import Navbar from "./Navbar";

const TransactionHistory = () => {
  const userId = useSelector((state) => state.user.id);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/budget/${userId}`);
        const categoryList = response.data.map((budget) => ({
          id: budget._id,
          name: budget.category,
        }));
        setCategories(categoryList);
      } catch (error) {
        console.error("Error fetching categories from budget:", error);
      }
    };

    if (userId) {
      fetchCategories();
    }
  }, [userId]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.startDate)
          queryParams.append("startDate", filters.startDate);
        if (filters.endDate) queryParams.append("endDate", filters.endDate);
        if (filters.category && filters.category !== "")
          queryParams.append("category", filters.category);

        const url = `${SERVER_URL}/transactions/${userId}?${queryParams.toString()}`;
        const response = await axios.get(url);
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (userId) {
      fetchTransactions();
    }
  }, [userId, filters]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    // Add title
    doc.text("Transaction History", 14, 16);
    doc.setFontSize(10);

    // Add headers
    doc.text("Date", 14, 30);
    doc.text("Category", 60, 30);
    doc.text("Amount", 120, 30);
    doc.text("Description", 160, 30);

    let y = 40;
    transactions.forEach((transaction) => {
      doc.text(new Date(transaction.date).toLocaleDateString(), 14, y);
      doc.text(transaction.category, 60, y);
      doc.text(`$${transaction.amount}`, 120, y);
      doc.text(transaction.description, 160, y);
      y += 10; 
    });

    doc.save("transaction_history.pdf"); 
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-4 md:p-6 bg-gray-100 min-h-screen">
          <h2 className="text-2xl font-bold mb-6">Transaction History</h2>

          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadPDF}
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
              Download PDF
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4">Filters</h3>
            <form
              onSubmit={handleFilterSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Start Date */}
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md p-2"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  className="border border-gray-300 rounded-md p-2"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                />
              </div>

              {/* Category */}
              <div className="flex flex-col mb-4">
                <label className="mb-2 font-medium">Category</label>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                >
                  <option value="">All</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>

          {/* Transaction Table */}
          <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-xl font-semibold mb-4">Transaction List</h3>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="py-2 px-4">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4">{transaction.category}</td>
                      <td className="py-2 px-4">${transaction.amount}</td>
                      <td className="py-2 px-4">{transaction.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
