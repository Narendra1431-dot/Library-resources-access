import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReadingHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadingHistory();
  }, []);

  const fetchReadingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/resources/reading-history', config);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reading history:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reading History</h1>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <ul className="space-y-4">
          {history.map((session) => (
            <li key={session._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{session.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Duration: {session.duration} minutes</p>
              </div>
              <span className="text-sm text-gray-500">
                Last accessed: {new Date(session.lastAccessed).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
        {history.length === 0 && <p>No reading history.</p>}
      </div>
    </div>
  );
};

export default ReadingHistory;
