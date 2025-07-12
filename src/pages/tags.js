import React, { useEffect, useState } from 'react';

const API_BASE_URL = 'https://5914e34b-5374-4c2b-ac7f-284078e07b90-00-25n0w53arrsx8.janeway.replit.dev';

const Tags = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tags`, {
        credentials: 'include',
      });
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const createTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/tags`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTag.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setTags([...tags, data]);
        setNewTag('');
        setError('');
      } else {
        setError(data.error || 'Failed to create tag.');
      }
    } catch (err) {
      console.error('Create tag error:', err);
      setError('Failed to create tag.');
    }
  };

  const deleteTag = async (tagId) => {
    if (!window.confirm('Are you sure you want to delete this tag?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/tags/${tagId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        setTags(tags.filter(tag => tag.id !== tagId));
      }
    } catch (err) {
      console.error('Delete tag error:', err);
    }
  };

  const startEditing = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const saveEditedTag = async () => {
    if (!editingTagName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/tags/${editingTagId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingTagName.trim() }),
      });

      if (res.ok) {
        const updated = tags.map(tag =>
          tag.id === editingTagId ? { ...tag, name: editingTagName } : tag
        );
        setTags(updated);
        setEditingTagId(null);
        setEditingTagName('');
      }
    } catch (err) {
      console.error('Edit tag error:', err);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>Manage Tags</h2>

      <form onSubmit={createTag} style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button type="submit">Add Tag</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
        {tags.map(tag => (
          <li key={tag.id} style={{ marginBottom: '10px' }}>
            {editingTagId === tag.id ? (
              <>
                <input
                  value={editingTagName}
                  onChange={(e) => setEditingTagName(e.target.value)}
                  style={{ padding: '6px', marginRight: '10px' }}
                />
                <button onClick={saveEditedTag}>Save</button>
                <button onClick={() => setEditingTagId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{tag.name}</strong>
                <button onClick={() => startEditing(tag)} style={{ marginLeft: '10px' }}>
                  Edit
                </button>
                <button onClick={() => deleteTag(tag.id)} style={{ marginLeft: '6px' }}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tags;
