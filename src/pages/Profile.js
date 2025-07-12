import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Profile.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const countries = [
  "United States", "Canada", "United Kingdom", "India", "Australia", "Germany", "France", "China", "Japan", "Brazil",
  "South Africa", "Nigeria", "Kenya", "Mexico", "Russia", "Italy", "Spain", "Netherlands", "Sweden", "Norway",
];

// ✅ Use deployed backend URL
const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

const Profile = () => {
  const location = useLocation();

  const [userData, setUserData] = useState({
    userId: '',
    email: '',
    name: '',
    country: '',
    gender: '',
    customGender: '',
    age: '',
    age_change_count: 0,
  });

  const [showModal, setShowModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = () => {
    axios
      .get(`${API_BASE_URL}/api/profile`, { withCredentials: true })
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        toast.error('Failed to load user data.');
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, [location]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('name', userData.name.trim());
    formData.append('country', userData.country.trim());
    formData.append('gender', userData.gender === 'Other' ? userData.customGender.trim() : userData.gender.trim());
    formData.append('age', userData.age);

    axios
      .put(`${API_BASE_URL}/api/profile`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(() => {
        toast.success('Profile updated successfully!');
        fetchUserProfile();
      })
      .catch((err) => {
        console.error('Error saving changes:', err);
        toast.error(err.response?.data?.error || 'Failed to save changes.');
      })
      .finally(() => setLoading(false));
  };

  const handleDelete = () => {
    if (!agree || password.trim() === '') {
      toast.warn('Please agree and enter your password.');
      return;
    }

    axios
      .post(
        `${API_BASE_URL}/api/delete-account`,
        { password },
        { withCredentials: true }
      )
      .then(() => {
        toast.success('Account deleted. Redirecting...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      })
      .catch((err) => {
        console.error('Delete error:', err);
        toast.error(err.response?.data?.error || 'Failed to delete account.');
      });

    setShowModal(false);
  };

  return (
    <div className="profile-container">
      <div className="form-section">
        <div className="input-row">
          <div className="input-group">
            <label>User ID</label>
            <input type="text" value={userData.userId} disabled />
          </div>
          <div className="input-group">
            <label>Name</label>
            <input name="name" value={userData.name} onChange={handleChange} />
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Email</label>
            <input name="email" value={userData.email} disabled />
          </div>
          <div className="input-group">
            <label>Gender</label>
            <select name="gender" value={userData.gender || ''} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
              <option>Other</option>
            </select>
            {userData.gender === 'Other' && (
              <input
                type="text"
                name="customGender"
                placeholder="Please specify"
                value={userData.customGender || ''}
                onChange={handleChange}
              />
            )}
          </div>
        </div>
        <div className="input-row">
          <div className="input-group">
            <label>Date of Birth</label>
            <input
              name="age"
              type="date"
              value={userData.age || ''}
              onChange={handleChange}
              disabled={userData.age_change_count >= 2}
            />
            {userData.age_change_count >= 2 && (
              <small style={{ color: '#ccc' }}>Date of birth change limit reached</small>
            )}
          </div>
          <div className="input-group">
            <label>Country</label>
            <select name="country" value={userData.country || ''} onChange={handleChange}>
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-row">
          <button className="save-btn" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="delete-btn" onClick={() => setShowModal(true)}>Delete Account</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Are you sure?</h3>
            <p>This action is <strong>irreversible</strong>. Your account will be permanently deleted.</p>
            <label className="checkbox">
              <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
              I understand and agree
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleDelete}>Confirm Delete</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Profile;
