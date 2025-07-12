// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import '../pages/dashboard.css';
import {
  FaUser,
  FaMicrophone,
  FaHistory,
  FaFolder,
  FaTags,
  FaSignOutAlt,
  FaBars,
} from 'react-icons/fa';

import Profile from './Profile';
import Transcribe from './Transcribe';
import TranscriptionHistory from './TranscriptionHistory';
import Projects from './Projects';
import Tags from './tags';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('transcribe');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = await response.json();
        alert('Logout failed: ' + data.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred while logging out.');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'GET',
        credentials: 'include',
      });

      if (res.status === 401) {
        navigate('/login');
        return;
      }

      const data = await res.json();
      setUserData({ user: data });
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderContent = () => {
    if (loading) return <div className="loading">Loading...</div>;
    if (!userData) return <div className="error">Failed to load user data.</div>;

    switch (activeComponent) {
      case 'profile':
        return <Profile user={userData.user || {}} />;
      case 'transcribe':
        return <Transcribe />;
      case 'history':
        return <TranscriptionHistory transcripts={userData.transcripts || []} />;
      case 'projects':
        return <Projects />;
      case 'tags':
        return <Tags />;
      default:
        return <Transcribe />;
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <h3>Dashboard</h3>}
          <div className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FaBars />
          </div>
        </div>

        <ul className="nav-items">
          <li onClick={() => setActiveComponent('profile')} className={activeComponent === 'profile' ? 'active' : ''}>
            <FaUser className="icon" />
            {sidebarOpen && 'Profile'}
          </li>
          <li onClick={() => setActiveComponent('transcribe')} className={activeComponent === 'transcribe' ? 'active' : ''}>
            <FaMicrophone className="icon" />
            {sidebarOpen && 'Transcribe File'}
          </li>
          <li onClick={() => setActiveComponent('history')} className={activeComponent === 'history' ? 'active' : ''}>
            <FaHistory className="icon" />
            {sidebarOpen && 'Transcribed Files'}
          </li>
          <li onClick={() => setActiveComponent('projects')} className={activeComponent === 'projects' ? 'active' : ''}>
            <FaFolder className="icon" />
            {sidebarOpen && 'Projects'}
          </li>
          <li onClick={() => setActiveComponent('tags')} className={activeComponent === 'tags' ? 'active' : ''}>
            <FaTags className="icon" />
            {sidebarOpen && 'Tags'}
          </li>
        </ul>

        <div className="logout-container">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="content-area">{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
