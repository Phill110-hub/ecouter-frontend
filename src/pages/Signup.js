import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setErrors({});
        setSubmitted(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    if (!formData.acceptedTerms) {
      setErrors({ acceptedTerms: 'You must accept the terms and conditions' });
      setLoading(false);
      return;
    }

    // Call API to register user (replace with your actual signup endpoint)
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success('Signup successful! Please check your email to verify.');
        navigate('/login'); // Redirect to login page after successful signup
      } else {
        toast.error(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to sign up. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container fade-in">
      <h2 className="signup-title">Join Écouter</h2>

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

        <button
          className="email-button"
          type="submit"
          disabled={loading}
        >
          Continue with Email
        </button>
      </form>

      {/* Google Sign-In */}
      <button
        className="google-button shine-hover"
        onClick={() =>
          (window.location.href =
            'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev/login/google')
        }
      >
        <svg
          className="google-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
        >
          <path
            fill="#fbc02d"
            d="M43.6 20.5H42V20H24v8h11.3c-1.7 4.8-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.2 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-8 20-20 0-1.3-.1-2.7-.4-3.5z"
          />
          <path
            fill="#e53935"
            d="M6.3 14.7l6.6 4.8C14.3 16.2 18.8 14 24 14c3 0 5.7 1.1 7.8 2.9l6-6C34.5 6.2 29.6 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"
          />
          <path
            fill="#4caf50"
            d="M24 44c5.4 0 10.3-2.1 13.9-5.5l-6.4-5.4C29.7 34.6 27 36 24 36c-5.1 0-9.6-3.2-11.3-8l-6.5 5c3.3 6.4 10 11 17.8 11z"
          />
          <path
            fill="#1565c0"
            d="M43.6 20.5H42V20H24v8h11.3c-0.8 2.3-2.4 4.3-4.3 5.6l6.4 5.4c-0.4 0.3 6.6-5 6.6-15.5 0-1.3-.1-2.7-.4-3.5z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="login-link">
        Already have an account? <Link to="/login">Log in</Link>
      </div>

      <ToastContainer
        position="bottom-center"
        autoClose={4000}
        hideProgressBar={false}
        transition={Slide}
        theme="colored"
      />
    </div>
  );
}

export default Signup;

