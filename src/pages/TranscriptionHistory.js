import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'https://your-api-url.com'; // Replace with your actual API base URL

const TranscriptionHistory = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const isDeleteAllDisabled = transcriptions.length === 0 || showDeleted;

  useEffect(() => {
    fetchTranscripts();
  }, [showDeleted]);

  const fetchTranscripts = () => {
    const endpoint = showDeleted ? '/api/deleted_transcripts' : '/api/transcripts';
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setTranscriptions(data))
      .catch(err => console.error('Error fetching transcriptions:', err));
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Delete ALL transcriptions? This cannot be undone!")) return;

    Promise.all(
      transcriptions.map(t =>
        fetch(`${API_BASE_URL}/api/transcripts/${t.id}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      )
    )
      .then(() => setTranscriptions([]))
      .catch(err => {
        alert("Some transcripts couldn't be deleted.");
        console.error(err);
      });
  };

  const handleDownload = (filename, text) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename || "transcript.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/api/transcripts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then(() => {
        setTranscriptions(prev => prev.filter(t => t.id !== id));
      })
      .catch(err => console.error("Delete failed:", err));
  };

  const handleRestore = (id) => {
    fetch(`${API_BASE_URL}/api/restore_transcript/${id}`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(() => {
        setTranscriptions(prev => prev.filter(t => t.id !== id));
      })
      .catch(err => console.error("Restore failed:", err));
  };

  return (
    <div className="content-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'white' }}>
          {showDeleted ? "Deleted Transcripts" : "Your Transcribed Files"}
        </h2>
        <div>
          {!showDeleted && transcriptions.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isDeleteAllDisabled}
              style={{
                marginRight: '10px',
                background: '#007b83',
                color: 'white',
                padding: '8px 14px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Delete All
            </button>
          )}
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            style={{
              marginRight: '10px',
              background: '#34495e',
              color: 'white',
              padding: '8px 14px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {showDeleted ? "Back to History" : "Show Deleted"}
          </button>
        </div>
      </div>

      {transcriptions.length === 0 ? (
        <p style={{ color: 'white', marginTop: '20px' }}>🎉 Coming Soon</p>
      ) : (
        <ul className="transcription-list" style={{ marginTop: '20px' }}>
          {transcriptions.map(t => (
            <li key={t.id} className="transcription-item" style={{
              background: '#1e1e1e',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '8px',
              color: 'white'
            }}>
              <strong>{t.filename}</strong>
              <p>{t.text ? t.text.slice(0, 100) + '...' : 'No transcript available.'}</p>
              <div className="transcription-actions" style={{ marginTop: '10px' }}>
                {!showDeleted ? (
                  <>
                    <button
                      onClick={() => { setSelectedTranscript(t); setShowModal(true); }}
                      style={buttonStyle}
                    >
                      View Full
                    </button>
                    <button
                      onClick={() => handleDownload(t.filename, t.text)}
                      style={buttonStyle}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{ ...buttonStyle, background: '#555' }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRestore(t.id)}
                    style={{ ...buttonStyle, background: '#1abc9c' }}
                  >
                    Restore
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && selectedTranscript && (
        <div className="modal" style={modalStyle}>
          <div className="modal-content" style={modalContentStyle}>
            <h3 style={{ color: 'white' }}>{selectedTranscript.filename}</h3>
            <p style={{ color: 'white', whiteSpace: 'pre-wrap' }}>{selectedTranscript.text}</p>
            <button onClick={() => setShowModal(false)} style={buttonStyle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  background: '#2980b9',
  color: 'white',
  padding: '6px 12px',
  marginRight: '8px',
  borderRadius: '5px',
  border: 'none',
  cursor: 'pointer',
};

const modalStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 999,
};

const modalContentStyle = {
  background: '#2c3e50',
  padding: '20px',
  borderRadius: '10px',
  maxWidth: '600px',
  width: '90%',
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default TranscriptionHistory;
