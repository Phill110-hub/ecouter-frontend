import React, { useState } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../pages/AuthContext';

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const API_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const { name, email, password, confirmPassword, acceptedTerms } = formData;
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields.');
      return false;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return false;
    }
    if (!acceptedTerms) {
      toast.error('You must accept the Terms and Conditions.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setEmailSent(true);
      } else {
        toast.error(data.error || 'Signup failed.');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      toast.error('An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Enter a valid 6-digit code.');
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        login(data.user);
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      console.error('❌ Verification error:', err);
      toast.error('Verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="signup-container fade-in">
      <h2 className="signup-title">Join Écouter</h2>

      {!emailSent ? (
        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <div className="terms">
            <label>
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
              />
              I accept the <a href="#">Terms and Conditions</a>
            </label>
          </div>
          <button className="email-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Continue with Email'}
          </button>
        </form>
      ) : (
        <div className="verify-section">
          <p className="verify-instructions">
            We've sent a 6-digit verification code to <b>{formData.email}</b>. Enter it below to verify your account.
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button className="verify-button" onClick={handleVerifyCode} disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      )}

      <button
        className="google-button shine-hover"
        onClick={() =>
          (window.location.href = `${API_URL}/login/google`)
        }
      >
        <svg className="google-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path fill="#fbc02d" d="M43.6 20.5H42V20H24v8h11.3..." />
          <path fill="#e53935" d="M6.3 14.7l6.6 4.8C14.3 16.2..." />
          <path fill="#4caf50" d="M24 44c5.4 0 10.3-2.1 13.9..." />
          <path fill="#1565c0" d="M43.6 20.5H42V20H24v8h11.3..." />
        </svg>
        Continue with Google
      </button>

      <div className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </div>

      <ToastContainer position="bottom-center" autoClose={4000} hideProgressBar={false} transition={Slide} theme="colored" />
    </div>
  );
}

export default Signup;
