// src/pages/ResetPassword.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Reusing the login styles

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

function ResetPassword() {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // This is the new backend endpoint you will need to create
      const response = await axios.post(`${API_BASE_URL}/api/reset-password`, {
        token,
        password,
      });

      setMessage(response.data.message || 'Your password has been reset successfully!');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Reset Your Password</h2>
      
      {!message ? (
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="email-button" style={{ background: '#000', border: '1px solid #444' }}>
            Update Password
          </button>
        </form>
      ) : null}

      {message && <p style={{ color: 'lightgreen', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default ResetPassword;
