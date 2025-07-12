import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const TranscriptDetail = () => {
  const { id } = useParams();
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev/api/transcripts/${id}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setTranscript(data);
        }
      })
      .catch(err => {
        console.error("Error fetching transcript:", err);
        setError("Failed to load transcript.");
      });
  }, [id]);

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  if (!transcript) {
    return <div className="p-8 text-white">Loading transcript...</div>;
  }

  return (
    <div style={{ padding: '30px', backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
      <div style={{
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        boxShadow: '0 0 8px rgba(0,0,0,0.3)'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          {transcript.filename}
        </h2>
        <p><strong>Status:</strong> {transcript.status}</p>
        <p><strong>Created:</strong> {new Date(transcript.created_at).toLocaleString()}</p>

        {transcript.topic && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>🧠 Topic:</h3>
            <p style={{ color: '#ccc' }}>{transcript.topic}</p>
          </div>
        )}

        {transcript.summary && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>📌 Summary:</h3>
            <ul style={{ paddingLeft: '20px', color: '#ccc' }}>
              {transcript.summary.split('\n').map((line, index) => (
                <li key={index}>{line.replace(/^-/, '').trim()}</li>
              ))}
            </ul>
          </div>
        )}

        <hr style={{ borderTop: '1px solid #555', margin: '30px 0' }} />

        <div style={{
          whiteSpace: 'pre-wrap',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#ddd',
          backgroundColor: '#1b1b1b',
          padding: '15px',
          borderRadius: '6px'
        }}>
          {transcript.text}
        </div>
      </div>
    </div>
  );
};

export default TranscriptDetail;
