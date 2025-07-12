// TranscribeFile.js
import React, { useState } from 'react';
import './transcription.css';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

function TranscribeFile() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTranscript('');
    setSummary('');
  };

  const handleTranscribe = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    fetch(`${API_BASE_URL}/api/transcribe`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert("Transcription failed: " + data.error);
        } else {
          setTranscript(data.transcript);
          setSummary(data.summary);
        }
      })
      .catch(err => {
        console.error('Transcription error:', err);
        alert('An error occurred while transcribing the file.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="content-area">
      <h2>Transcribe Audio File</h2>
      <div className="upload-box">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleTranscribe} disabled={loading}>
          {loading ? 'Transcribing...' : 'Transcribe'}
        </button>
      </div>

      {transcript && (
        <div className="result-box">
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}

      {summary && (
        <div className="result-box">
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default TranscribeFile;
