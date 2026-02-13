import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/resources/bookmarks', config);
      setBookmarks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setLoading(false);
    }
  };

  const removeBookmark = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/resources/bookmarks/${id}`, config);
      setBookmarks(bookmarks.filter(bookmark => bookmark._id !== id));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookmarks</h1>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <ul className="space-y-4">
          {bookmarks.map((bookmark) => (
            <li key={bookmark._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{bookmark.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">by {bookmark.author}</p>
              </div>
              <button
                onClick={() => removeBookmark(bookmark._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        {bookmarks.length === 0 && <p>No bookmarks.</p>}
      </div>
    </div>
  );
};

export default Bookmarks;
