import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Reader = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ pageNumber: 1, highlightText: '', noteText: '' });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchResource();
    fetchNotes();
  }, [id]);

  const fetchResource = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/resources/${id}`);
      setResource(response.data);
    } catch (error) {
      console.error('Error fetching resource:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/resources/${id}/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/resources/${id}/notes`, newNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewNote({ pageNumber: 1, highlightText: '', noteText: '' });
      fetchNotes();
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const downloadResource = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/resources/${id}/download`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Download recorded!');
    } catch (error) {
      alert('Download failed or limit exceeded');
    }
  };

  if (!resource) return <div>Loading...</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{resource.title}</h1>
          <div className="flex space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button onClick={downloadResource} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700">
              Download
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className={`p-6 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Content</h2>
              <div className="prose max-w-none">
                {/* Mock content - in real app, render PDF or text */}
                <p>This is a placeholder for the e-book content. In a real implementation, you would render the PDF or text content here.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                {/* Add more mock content */}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4">Add Note</h3>
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Page Number"
                  value={newNote.pageNumber}
                  onChange={(e) => setNewNote({ ...newNote, pageNumber: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Highlight Text"
                  value={newNote.highlightText}
                  onChange={(e) => setNewNote({ ...newNote, highlightText: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="2"
                />
                <textarea
                  placeholder="Your Note"
                  value={newNote.noteText}
                  onChange={(e) => setNewNote({ ...newNote, noteText: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
                <button onClick={addNote} className="w-full bg-accent text-white py-2 rounded hover:bg-yellow-600">
                  Add Note
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="text-lg font-semibold mb-4">Your Notes ({notes.length})</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note._id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <p className="text-sm"><strong>Page {note.pageNumber}:</strong> {note.highlightText}</p>
                    <p className="text-sm mt-1">{note.noteText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reader;
