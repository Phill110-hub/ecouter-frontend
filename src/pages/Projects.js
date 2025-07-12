import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // for routing

const BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedDesc, setEditedDesc] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch(`${BASE_URL}/api/projects`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error("Error loading projects:", err));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return setErrorMsg("Project name is required.");

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim(), description: newProjectDesc.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(prev => [...prev, data]);
        setNewProjectName('');
        setNewProjectDesc('');
      } else setErrorMsg(data.error || 'Failed to create project.');
    } catch (error) {
      console.error("Create error:", error);
      setErrorMsg('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project.id);
    setEditedName(project.name);
    setEditedDesc(project.description);
  };

  const saveEdit = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editedName, description: editedDesc }),
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === id ? { ...p, name: editedName, description: editedDesc } : p));
        setEditingProjectId(null);
      } else {
        alert("Failed to update project.");
      }
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const toggleExpand = async (id) => {
    if (expandedProjectId === id) {
      setExpandedProjectId(null);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/projects/${id}/transcripts`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      setProjects(projects.map(p => p.id === id ? { ...p, transcripts: data } : p));
      setExpandedProjectId(id);
    } catch (err) {
      console.error("Error loading transcripts:", err);
    }
  };

  return (
    <div className="projects-container" style={{ padding: '20px', color: 'white' }}>
      <h2>Your Projects</h2>

      <form onSubmit={handleCreateProject} style={{ marginTop: '20px', background: '#1e1e1e', padding: '20px', borderRadius: '8px' }}>
        <h4>Create New Project</h4>

        <input
          type="text"
          value={newProjectName}
          onChange={(e) => setNewProjectName(e.target.value)}
          placeholder="Project Name"
          style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', backgroundColor: '#2c2c2c', border: '1px solid #444', color: 'white' }}
        />
        <textarea
          value={newProjectDesc}
          onChange={(e) => setNewProjectDesc(e.target.value)}
          placeholder="Project Description"
          style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '5px', backgroundColor: '#2c2c2c', border: '1px solid #444', color: 'white' }}
        />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit" disabled={loading} style={{ background: 'white', color: 'black', padding: '10px 20px', borderRadius: '5px' }}>
          {loading ? 'Creating...' : 'Create Project'}
        </button>
      </form>

      <div style={{ marginTop: '30px' }}>
        <h4>All Projects</h4>
        {projects.map((project) => (
          <div key={project.id} style={{ marginBottom: '15px', background: '#1b1b1b', padding: '15px', borderRadius: '6px' }}>
            {editingProjectId === project.id ? (
              <>
                <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                <textarea value={editedDesc} onChange={(e) => setEditedDesc(e.target.value)} />
                <button onClick={() => saveEdit(project.id)}>Save</button>
                <button onClick={() => setEditingProjectId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{project.name}</strong> - <span style={{ color: '#aaa' }}>{project.description || 'No description'}</span>
                <br />
                <button onClick={() => toggleExpand(project.id)} style={{ marginRight: '10px' }}>
                  {expandedProjectId === project.id ? 'Hide Transcripts' : 'View Transcripts'}
                </button>
                <button onClick={() => handleEdit(project)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(project.id)} style={{ color: 'red' }}>Delete</button>
              </>
            )}

            {expandedProjectId === project.id && project.transcripts && (
              <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
                {project.transcripts.length > 0 ? (
                  project.transcripts.map(t => (
                    <li key={t.id} style={{ marginBottom: '8px', color: '#ccc' }}>
                      <strong>{t.filename}</strong><br />
                      <small>Status: {t.status}</small><br />
                      <small>Created: {new Date(t.created_at).toLocaleString()}</small><br />
                      <button
                        onClick={() => navigate(`/transcript/${t.id}`)}
                        style={{
                          marginTop: '5px',
                          padding: '4px 10px',
                          fontSize: '0.85rem',
                          borderRadius: '5px',
                          backgroundColor: '#333',
                          color: 'white',
                          border: '1px solid #555'
                        }}
                      >
                        View Full
                      </button>
                    </li>
                  ))
                ) : (
                  <li>No transcripts in this project yet.</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
