
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../Redux/userSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userName = useSelector((state) => state.user.name);

  const handleLogout = () => {
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-3 flex justify-between items-center shadow-lg">
      <h1 className="text-2xl font-bold text-white">Expense Tracker</h1>
      <div className="flex items-center space-x-4">
        <span className="text-white hidden md:block">{userName}</span>
        <button
          onClick={handleLogout}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
        >
          Logout
        </button>
      </div>
      <div className="md:hidden">
        <button
          className="text-white focus:outline-none"
          onClick={() => alert('Mobile Menu Clicked!')} 
        >
         
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18M3 12h18m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
