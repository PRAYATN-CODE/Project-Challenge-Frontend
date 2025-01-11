// src/App.jsx
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Auth from './Auth';
import Login from './Login';
import Dashboard from './Pages/Dashboard'; // Assuming you create a Dashboard component

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Auth> <Dashboard /> </Auth>} />
      </Routes>
    </Router>
  );
};

export default App;
