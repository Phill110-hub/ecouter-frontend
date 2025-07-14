import React from 'react';
import { FaMicrophone } from 'react-icons/fa';
import '../pages/dashboard.css'; // Reuse the same CSS

function EmptyDashboard({ setActiveComponent }) {
  return (
    <div className="empty-dashboard">
      <h2>Welcome to Ecouter!</h2>
      <p>Your dashboard is ready. You haven't transcribed any files yet.</p>
      <button 
        className="empty-dashboard-button" 
        onClick={() => setActiveComponent('transcribe')}
      >
        <FaMicrophone style={{ marginRight: '8px' }} />
        Transcribe Your First File
      </button>
    </div>
  );
}

export default EmptyDashboard;
