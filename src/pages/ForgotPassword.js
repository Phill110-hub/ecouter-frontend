import React, { useState } from 'react';
import './Login.css'; // We can reuse the login page styles
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // This is the new backend endpoint you will need to create
      await axios.post(`${API_BASE_URL}/api/forgot-password`, { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Forgot Password</h2>
      <p style={{ color: '#aaa', textAlign: 'center', marginTop: '-1rem', marginBottom: '2rem' }}>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="email-button" style={{ background: '#000', border: '1px solid #444' }}>
          Send Reset Link
        </button>
      </form>

      {message && <p style={{ color: 'lightgreen', textAlign: 'center', marginTop: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '1rem' }}>{error}</p>}

      <p className="signup-link">
        Remembered your password?{' '}
        <button className="link-button" onClick={() => navigate('/login')}>
          Back to Login
        </button>
      </p>
    </div>
  );
}

export default ForgotPassword;
