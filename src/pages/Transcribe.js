import React, { useState, useRef, useEffect } from 'react';
import './Transcribe.css';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

function Transcribe() {
  const [file, setFile] = useState(null);
  const [verbatim, setVerbatim] = useState(false);
  const [diarization, setDiarization] = useState(false);
  const [useAISummary, setUseAISummary] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [language, setLanguage] = useState('en');
  const [tags, setTags] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const [transcript, setTranscript] = useState(localStorage.getItem('transcript') || '');
  const [summary, setSummary] = useState(localStorage.getItem('summary') || '');
  const [topic, setTopic] = useState(localStorage.getItem('topic') || '');
  const [audioUrl, setAudioUrl] = useState(localStorage.getItem('audioUrl') || '');
  const [wordList, setWordList] = useState(JSON.parse(localStorage.getItem('wordList')) || []);
  const [loading, setLoading] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState(null);
  const [processingTranscriptId, setProcessingTranscriptId] = useState(localStorage.getItem('processingId'));

  const audioRef = useRef(null);
  const transcriptRef = useRef(null);
  const scrollButtonRef = useRef(null);
  const [highlightTranscript, setHighlightTranscript] = useState(false);

  const languageOptions = [
    { code: 'en', name: 'English' }, { code: 'fr', name: 'French' }, { code: 'es', name: 'Spanish' },
    { code: 'sw', name: 'Swahili' }, { code: 'de', name: 'German' }, { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }, { code: 'zh', name: 'Chinese' }, { code: 'ru', name: 'Russian' },
    { code: 'pt', name: 'Portuguese' }, { code: 'it', name: 'Italian' }, { code: 'ko', name: 'Korean' },
    { code: 'ja', name: 'Japanese' }, { code: 'tr', name: 'Turkish' }, { code: 'nl', name: 'Dutch' },
    { code: 'pl', name: 'Polish' }, { code: 'uk', name: 'Ukrainian' }, { code: 'el', name: 'Greek' },
    { code: 'he', name: 'Hebrew' }, { code: 'bn', name: 'Bengali' }, { code: 'ta', name: 'Tamil' },
    { code: 'ur', name: 'Urdu' }, { code: 'zu', name: 'Zulu' }, { code: 'am', name: 'Amharic' },
    { code: 'yo', name: 'Yoruba' }
  ];

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/projects`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Failed to load projects:", err));
  }, []);

  const pollTranscriptStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/transcripts/${id}`, { credentials: 'include' });
      const data = await res.json();

      if (res.status === 404 || data.error) {
        console.warn("❌ Transcript not found or errored.");
        localStorage.removeItem('processingId');
        setProcessingTranscriptId(null);
        return;
      }

      if (data.status === 'complete') {
        setTranscript(data.text);
        setSummary(data.summary || '');
        setTopic(data.topic || '');
        const fullAudioUrl = `${API_BASE_URL}${data.audio_url}`;
        setAudioUrl(fullAudioUrl);

        const allWords = [];
        data.word_timings?.forEach(segment => {
          if (segment.words) {
            segment.words.forEach(word => allWords.push(word));
          }
        });
        setWordList(allWords);

        localStorage.setItem('transcript', data.text);
        localStorage.setItem('summary', data.summary || '');
        localStorage.setItem('topic', data.topic || '');
        localStorage.setItem('audioUrl', fullAudioUrl);
        localStorage.setItem('wordList', JSON.stringify(allWords));
        localStorage.removeItem('processingId');
        setProcessingTranscriptId(null);

        setTimeout(() => {
          transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
          setHighlightTranscript(true);
          setTimeout(() => setHighlightTranscript(false), 3000);
          audioRef.current?.play().catch(() => {});
        }, 500);
      } else {
        setTimeout(() => pollTranscriptStatus(id), 5000);
      }
    } catch (error) {
      console.error('Polling error:', error);
      localStorage.removeItem('processingId');
      setProcessingTranscriptId(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please choose a file.");

    setLoading(true);
    setTranscript('');
    setSummary('');
    setTopic('');
    setAudioUrl('');
    setWordList([]);
    localStorage.clear();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('verbatim', verbatim);
    formData.append('diarization', diarization);
    formData.append('language', language);
    formData.append('use_ai_summary', useAISummary);
    formData.append('include_timestamps', includeTimestamps);
    if (selectedProjectId) formData.append('project_id', selectedProjectId);
    formData.append('tags', tags);

    try {
      const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setTranscript(data.transcript);
        setSummary(data.summary || '');
        setTopic(data.topic || '');
        setAudioUrl(data.audio_url);

        const allWords = Array.isArray(data.word_timings) ? data.word_timings : [];
        setWordList(allWords);

        localStorage.setItem('transcript', data.transcript);
        localStorage.setItem('summary', data.summary || '');
        localStorage.setItem('topic', data.topic || '');
        localStorage.setItem('audioUrl', data.audio_url);
        localStorage.setItem('wordList', JSON.stringify(allWords));

        if (data.id) {
          localStorage.setItem('processingId', data.id);
          setProcessingTranscriptId(data.id);
        }

        setTimeout(() => {
          transcriptRef.current?.scrollIntoView({ behavior: 'smooth' });
          setHighlightTranscript(true);
          setTimeout(() => setHighlightTranscript(false), 3000);
          audioRef.current?.play().catch(() => {});
        }, 500);
      } else {
        alert(data.error || 'Transcription failed.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      alert('An error occurred while transcribing the file.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !wordList.length) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const index = wordList.findIndex(word =>
        currentTime >= word.start / 1000 && currentTime <= word.end / 1000
      );
      setActiveWordIndex(index);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', () => setActiveWordIndex(null));
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', () => setActiveWordIndex(null));
    };
  }, [wordList]);

  useEffect(() => {
    if (processingTranscriptId) {
      const confirmResume = window.confirm("Resume last unfinished transcription?");
      if (confirmResume) {
        pollTranscriptStatus(processingTranscriptId);
      } else {
        localStorage.removeItem('processingId');
        setProcessingTranscriptId(null);
      }
    }
  }, []);

  const isWordLevel = wordList.length > 0 && wordList.every(w => w.word || w.text);

  return (
    <div className="transcribe-container">
      <h2>Transcribe Audio File</h2>

      <div className="transcribe-box">
        <div className="transcribe-field">
          <label>Upload Audio/Video:</label>
          <input type="file" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="transcribe-checkboxes">
          <label><input type="checkbox" checked={verbatim} onChange={() => setVerbatim(!verbatim)} /> Verbatim</label>
          <label><input type="checkbox" checked={diarization} onChange={() => setDiarization(!diarization)} /> Identify Speakers</label>
          <label><input type="checkbox" checked={useAISummary} onChange={() => setUseAISummary(!useAISummary)} /> Generate AI Summary</label>
          <label><input type="checkbox" checked={includeTimestamps} onChange={() => setIncludeTimestamps(!includeTimestamps)} /> Include Timestamps</label>
          <label>
            Language:
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="transcribe-field">
          <label>Assign to Project:</label>
          <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
            <option value="">None</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="transcribe-field">
          <label>Tags (comma separated):</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g. meeting, client, sales" />
        </div>

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Transcribing...' : 'Transcribe'}
        </button>
      </div>

      {audioUrl && (
        <div className="audio-preview">
          <h3>Play Audio:</h3>
          <audio ref={audioRef} controls src={audioUrl}></audio>
        </div>
      )}

      {transcript && (
        <>
          <button
            ref={scrollButtonRef}
            onClick={() => transcriptRef.current?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              marginTop: '20px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#ffffff10',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            📜 Scroll to Transcript
          </button>

          <div className={`transcript-output ${highlightTranscript ? 'highlight-flash' : ''}`} ref={transcriptRef}>
            <h3>Transcript:</h3>
            {isWordLevel ? (
              <div className="word-highlighting">
                {wordList.map((word, index) => (
                  <span key={index} className={index === activeWordIndex ? 'highlight' : ''}>
                    {(word.word || word.text || '[?]') + ' '}
                  </span>
                ))}
              </div>
            ) : (
              <div className="paragraph-format">
                {transcript.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {(summary || topic) && (
        <div className="summary-box">
          {topic && (
            <>
              <h3>Topic:</h3>
              <p>{topic}</p>
            </>
          )}
          {summary && (
            <>
              <h3>Summary:</h3>
              <p>{summary}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Transcribe;
