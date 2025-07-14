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
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Using axios for cleaner requests

// Import your page components
import Profile from './Profile';
import Transcribe from './Transcribe';
import TranscriptionHistory from './TranscriptionHistory';
import Projects from './Projects';
import Tags from './tags';
// NEW: Import the empty state component we'll create
import EmptyDashboard from './EmptyDashboard';

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [activeComponent, setActiveComponent] = useState('transcribe');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  // NEW: State to hold the list of transcripts
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // This function can remain as is
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

  // UPDATED: Fetch all necessary data when the dashboard loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch profile and transcripts data at the same time for efficiency
        const [profileRes, transcriptsRes] = await Promise.all([
          axios.get(`${API_URL}/api/profile`, { withCredentials: true }),
          axios.get(`${API_URL}/api/transcripts`, { withCredentials: true })
        ]);

        setUserData({ user: profileRes.data });
        setTranscripts(transcriptsRes.data);

      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        // If unauthorized, redirect to login
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]); // Dependency array includes navigate

  const renderContent = () => {
    // This function now just decides which main component to show
    switch (activeComponent) {
      case 'profile':
        return <Profile user={userData.user || {}} />;
      case 'transcribe':
        return <Transcribe />;
      case 'history':
        // Pass the fetched transcripts to the history component
        return <TranscriptionHistory transcripts={transcripts} />;
      case 'projects':
        return <Projects />;
      case 'tags':
        return <Tags />;
      default:
        return <Transcribe />;
    }
  };

  // The main return logic is now updated to handle the empty state
  return (
    <div className="dashboard-container">
      {/* Sidebar remains the same */}
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
        <div className="content-area">
          {loading ? (
            <div className="loading">Loading Dashboard...</div>
          ) : transcripts.length === 0 ? (
            // If the user has no transcripts, show the new welcome component
            <EmptyDashboard setActiveComponent={setActiveComponent} />
          ) : (
            // Otherwise, show the normal content based on the active component
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
