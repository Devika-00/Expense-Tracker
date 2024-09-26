
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`flex flex-col bg-gray-800 text-white w-64 min-h-screen pl-10 transition-transform duration-300`}>
      <div className="md:hidden mb-5">
        <button 
          className="text-white bg-gray-700 px-4 py-2 rounded" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
      </div>

      
      <nav className={`space-y-3 ${isOpen ? 'block' : 'hidden md:block'}`}>
        <Link to="/" className="block py-2 hover:bg-gray-700 rounded">Home</Link>
        <Link to="/add-expense" className="block py-2 hover:bg-gray-700 rounded">Update Expense</Link>
        <Link to="/transaction-history" className="block py-2 hover:bg-gray-700 rounded">Transaction History</Link>
        <Link to="/graph" className="block py-2 hover:bg-gray-700 rounded">Expense Graph</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
