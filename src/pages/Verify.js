import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Verify.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../pages/AuthContext';

function Verify() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const API_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (!emailParam) {
      toast.error('Email is missing from verification URL.');
      navigate('/signup');
    } else {
      setEmail(emailParam);
    }
  }, [searchParams, navigate]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error('Enter a valid 6-digit code.');
      return;
    }

    setVerifying(true);
    try {
      const res = await fetch(`${API_URL}/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        login(data.user); // 👈 or remove if you want manual login
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(data.error || 'Invalid or expired code.');
      }
    } catch (err) {
      toast.error('Network error. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="verify-container">
      <h2>Email Verification</h2>
      <p>Please enter the 6-digit code sent to:</p>
      <b>{email}</b>

      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button onClick={handleVerify} disabled={verifying}>
        {verifying ? 'Verifying...' : 'Verify Email'}
      </button>

      <ToastContainer position="bottom-center" autoClose={4000} />
    </div>
  );
}

export default Verify;
