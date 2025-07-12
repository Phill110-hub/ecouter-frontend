import React, { useEffect, useState } from 'react';
import './dashboard.css';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

const TranscriptionHistory = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [translatingId, setTranslatingId] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [languageMap, setLanguageMap] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/transcripts`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setTranscriptions(data))
      .catch(err => console.error('Error fetching transcriptions:', err));
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/translate/languages`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setLanguages(['English', ...data.filter(l => l.toLowerCase() !== 'english')]);
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
    if (!window.confirm("Are you sure you want to delete this transcript? This cannot be undone.")) return;

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
        headers: {
          'Content-Type': 'application/json'
        },
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
    <div className="content-area">
      <h2>Your Transcribed Files</h2>
      {transcriptions.length === 0 ? (
        <p>No transcriptions yet. Upload and transcribe a file!</p>
      ) : (
        <ul className="transcription-list">
          {transcriptions.map(t => (
            <li key={t.id} className="transcription-item">
              <strong>{t.filename}</strong>
              <p>{t.text ? t.text.slice(0, 100) + '...' : 'No transcript available.'}</p>

              {t.tags && t.tags.length > 0 && (
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
                <button onClick={() => { setSelectedTranscript(t); setShowModal(true); }}>View Full</button>
                <button onClick={() => handleDownload(t.filename, t.text)}>Download</button>
                <button onClick={() => handleDelete(t.id)} className="delete-btn">Delete</button>

                <select
                  value={languageMap[t.id] || 'English'}
                  onChange={(e) => setLanguageMap(prev => ({ ...prev, [t.id]: e.target.value }))}
                  style={{
                    marginRight: '5px',
                    marginTop: '8px',
                    maxHeight: '150px',
                    overflowY: 'scroll',
                    width: '160px'
                  }}
                >
                  {languages.map((lang, idx) => (
                    <option key={idx} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>

                <button onClick={() => handleTranslate(t.id)} disabled={translatingId === t.id}>
                  {translatingId === t.id ? 'Translating...' : 'Translate'}
                </button>

                <audio controls style={{ marginTop: '10px' }}>
                  <source src={`${API_BASE_URL}/uploads/${encodeURIComponent(t.filename)}`} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {translatedText ? (
              <>
                <h3>Translated Transcript ({languageMap[selectedTranscript?.id] || 'English'})</h3>
                <pre style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {translatedText}
                </pre>
              </>
            ) : (
              <>
                <h3>{selectedTranscript?.filename}</h3>
                <pre style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {selectedTranscript?.text}
                </pre>
              </>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionHistory;
