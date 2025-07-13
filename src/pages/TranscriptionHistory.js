import React, { useEffect, useState } from 'react';
import './TranscriptionHistory.css';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

const TranscriptionHistory = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [translatingId, setTranslatingId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [languageMap, setLanguageMap] = useState({});
  const [showDeleted, setShowDeleted] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  useEffect(() => {
    fetchTranscripts();
  }, [showDeleted]);

  const fetchTranscripts = () => {
    const endpoint = showDeleted ? '/api/deleted_transcripts' : '/api/transcripts';
    fetch(`${API_BASE_URL}${endpoint}`, { method: 'GET', credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setTranscriptions(data);
        setButtonsDisabled(false);
      })
      .catch(err => console.error('Error fetching transcriptions:', err));
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/translate/languages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const unique = ['English', ...data.filter(l => l.toLowerCase() !== 'english')];
          setLanguages([...new Set(unique)].sort());
        } else {
          fallbackLanguages();
        }
      })
      .catch(err => {
        console.error("Failed to load languages:", err);
        fallbackLanguages();
      });
  }, []);

  const fallbackLanguages = () => {
    setLanguages([
      "English", "French", "Spanish", "German", "Swahili", "Arabic", "Hindi", "Chinese", "Russian",
      "Portuguese", "Italian", "Korean", "Japanese", "Turkish", "Dutch", "Polish",
      "Ukrainian", "Greek", "Hebrew", "Bengali", "Tamil", "Urdu", "Zulu", "Amharic", "Yoruba"
    ]);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this transcript?")) return;
    fetch(`${API_BASE_URL}/api/transcripts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => {
      if (res.ok) {
        setTranscriptions(transcriptions.filter(t => t.id !== id));
      } else {
        alert('Failed to delete transcript.');
      }
    });
  };

  const handleDeleteAll = () => {
    if (!window.confirm("Delete ALL transcriptions? This cannot be undone!")) return;
    Promise.all(
      transcriptions.map(t =>
        fetch(`${API_BASE_URL}/api/transcripts/${t.id}`, {
          method: 'DELETE',
          credentials: 'include'
        })
      )
    ).then(() => {
      setTranscriptions([]);
    }).catch(err => {
      alert("Some transcripts couldn't be deleted.");
      console.error(err);
    });
  };

  const handleRestore = (id) => {
    fetch(`${API_BASE_URL}/api/transcripts/${id}/restore`, {
      method: 'POST',
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) {
          setTranscriptions(transcriptions.filter(t => t.id !== id));
        } else {
          alert('Failed to restore transcript.');
        }
      })
      .catch(err => {
        alert("Error restoring transcript.");
        console.error(err);
      });
  };

  const handleDownload = (filename, text) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename.replace(/\.[^/.]+$/, "") + '.txt';
    link.click();
  };

  const handleTranslate = async (id) => {
    const language = languageMap[id] || 'English';
    setTranslatingId(id);
    setTranslatedText('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/translate/${id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language })
      });

      const data = await res.json();
      if (res.ok && data.translated_text) {
        setTranslatedText(data.translated_text);
        setShowModal(true);
      } else {
        alert(data.error || 'Translation failed.');
      }
    } catch (err) {
      console.error('Translate error:', err);
      alert("Error occurred during translation.");
    }
    setTranslatingId(null);
  };

  return (
    <div className="transcription-container fade-in">
      <div className="transcription-header">
        <h2>{showDeleted ? "Deleted Transcripts" : "Your Transcribed Files"}</h2>
        <div className="button-group">
          <div className="coming-soon">Coming Soon</div>
          {!showDeleted && transcriptions.length > 0 && (
            <button onClick={handleDeleteAll} className="btn danger" disabled={buttonsDisabled}>
              Delete All
            </button>
          )}
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className="btn danger"
            disabled={buttonsDisabled}
          >
            {showDeleted ? "Show Active" : "Show Deleted"}
          </button>
        </div>
      </div>

      {transcriptions.length === 0 ? (
        <p className="empty-message">No {showDeleted ? "deleted" : "active"} transcriptions found.</p>
      ) : (
        <ul className="transcription-list fade-in">
          {transcriptions.map(t => (
            <li key={t.id} className="transcription-item">
              <strong>{t.filename}</strong>
              <p>{t.text ? t.text.slice(0, 100) + '...' : 'No transcript available.'}</p>

              {t.tags?.length > 0 && (
                <div className="tag-box">
                  <strong>Tags:</strong>
                  <div className="tag-list">
                    {t.tags.map((tag, index) => (
                      <span key={index} className="tag-chip">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {t.summary && (
                <div className="summary-box">
                  <strong>Summary:</strong>
                  <p>{t.summary}</p>
                </div>
              )}

              <div className="transcription-actions">
                {!showDeleted ? (
                  <>
                    <button onClick={() => { setSelectedTranscript(t); setShowModal(true); }} disabled={buttonsDisabled}>View Full</button>
                    <button onClick={() => handleDownload(t.filename, t.text)} disabled={buttonsDisabled}>Download</button>
                    <button onClick={() => handleDelete(t.id)} className="delete-btn" disabled={buttonsDisabled}>Delete</button>

                    <select
                      value={languageMap[t.id] || 'English'}
                      onChange={(e) => setLanguageMap(prev => ({ ...prev, [t.id]: e.target.value }))}
                      className="language-select"
                      disabled={buttonsDisabled}
                    >
                      {languages.map((lang, idx) => (
                        <option key={idx} value={lang}>{lang}</option>
                      ))}
                    </select>

                    <button onClick={() => handleTranslate(t.id)} disabled={translatingId === t.id || buttonsDisabled}>
                      {translatingId === t.id ? 'Translating...' : 'Translate'}
                    </button>

                    <audio controls className="audio-player">
                      <source src={`${API_BASE_URL}/uploads/${encodeURIComponent(t.filename)}`} />
                      Your browser does not support the audio element.
                    </audio>
                  </>
                ) : (
                  <button onClick={() => handleRestore(t.id)} className="restore-btn" disabled={buttonsDisabled}>
                    Restore
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content slide-up" onClick={e => e.stopPropagation()}>
            {translatedText ? (
              <>
                <h3>Translated Transcript ({languageMap[selectedTranscript?.id] || 'English'})</h3>
                <pre className="transcript-text">{translatedText}</pre>
              </>
            ) : (
              <>
                <h3>{selectedTranscript?.filename}</h3>
                <pre className="transcript-text">{selectedTranscript?.text}</pre>
              </>
            )}
            <button onClick={() => setShowModal(false)} className="close-btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionHistory;
