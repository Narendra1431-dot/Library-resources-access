import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Downloads = () => {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get('http://localhost:5000/api/resources/downloads', config);
      setDownloads(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching downloads:', error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Downloads This Month</h1>
      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <ul className="space-y-4">
          {downloads.map((download) => (
            <li key={download._id} className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">{download.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">by {download.author}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(download.downloadDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
        {downloads.length === 0 && <p>No downloads this month.</p>}
      </div>
    </div>
  );
};

export default Downloads;
