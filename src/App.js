// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Verify from './pages/Verify';
import NotFound from './pages/NotFound';
import PostLogin from './pages/PostLogin';
import WelcomePage from './pages/WelcomePage';
import Home from './pages/Home';
import TranscriptDetail from './pages/TranscriptDetail';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
// NEW: Import the password reset pages
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import { useAuth } from './pages/AuthContext';
import SupportChat from './pages/SupportChat';

import './App.css';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading session...</h2>
      </div>
    );
  }

  return (
    <Router>
      <>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} />
          
          {/* --- NEW: PASSWORD RESET ROUTES --- */}
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />}
          />
          <Route
            path="/reset-password/:token"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <ResetPassword />}
          />

          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/post-login" element={<PostLogin />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/transcript/:id" element={isAuthenticated ? <TranscriptDetail /> : <Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {isAuthenticated && <SupportChat />}
      </>
    </Router>
  );
}

export default App;
