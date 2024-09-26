import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Components/Login';
import Dashboard from '../Components/Dashboard';
import AddExpense from '../Components/NewExpense';
import TransactionHistory from '../Components/TransactionHistoryPage';
import Register from '../Components/Register';
import { ProtectedRoute, PublicRoute } from '../Routes/PrivateRoute'; // Adjust the path accordingly
import GraphPage from '../Components/Grapgh';

const MainRouter = () => {
    return (
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
          <Route path="/transaction-history" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
          <Route path="/graph" element={<ProtectedRoute><GraphPage /></ProtectedRoute>} />
          
        </Routes>
      </Router>
    );
};

export default MainRouter;
