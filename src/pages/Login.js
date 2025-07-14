// src/pages/Login.js
import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/login/google`;
  };

  // NEW: Handler for the forgot password link
  const handleForgotPassword = () => {
    navigate('/forgot-password'); // This will take the user to the forgot password page
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { email, password }, { withCredentials: true });
      if (response.status === 200) {
        navigate('/transcribe'); // redirect after login
      }
    } catch (error) {
      setErrorMsg('Invalid email or password');
    }
  };

  return (
    <div className="login-container fade-in">
      <h2 className="login-title">Welcome Back to Écouter</h2>

      <form onSubmit={handleEmailLogin} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />

        {/* NEW: Forgot Password Button */}
        {/* It uses the CSS class from our previous conversation */}
        <button type="button" className="forgot-password-link" onClick={handleForgotPassword}>
          Forgot Password?
        </button>

        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <button type="submit" className="login-button">
          Login with Email
        </button>
      </form>

      {/* UPDATED: Changed class name to match CSS from previous step */}
      <div className="separator">OR</div>

      <button className="google-button" onClick={handleGoogleLogin}>
        <svg className="google-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.8-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.2 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-3.5z" />
          <path fill="#e53935" d="M6.3 14.7l6.6 4.8C14.3 16.2 18.8 14 24 14c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.2 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
          <path fill="#4caf50" d="M24 44c5.4 0 10.3-2.1 13.9-5.5l-6.4-5.4C29.7 34.6 27 36 24 36c-5.1 0-9.6-3.2-11.3-8l-6.5 5c3.3 6.4 10 11 17.8 11z" />
          <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.2-2.4 4.3-4.3 5.6l6.4 5.4c-0.4 0.3 6.6-5 6.6-15.5 0-1.3-.1-2.7-.4-3.5z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <p style={{ marginTop: '1.5rem', color: '#888', fontSize: '14px' }}>
        Don’t have an account?{' '}
        <button
          style={{
            background: 'none',
            border: 'none',
            color: '#2196f3',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '14px',
            padding: 0
          }}
          onClick={() => navigate('/signup')}
        >
          Go to Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
