import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentResources, setRecentResources] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [stats, setStats] = useState({ downloadsThisMonth: 0, bookmarksCount: 0, totalReadingTime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch stats
      const statsRes = await axios.get('http://localhost:5000/api/resources/dashboard/stats', config);
      setStats(statsRes.data);

      // Fetch recent books (popular books)
      const recentRes = await axios.get('http://localhost:5000/api/books?sortBy=rating&sortOrder=desc&limit=5');
      setRecentResources(recentRes.data.slice(0, 3));

      // Fetch book recommendations (books by category)
      const recRes = await axios.get('http://localhost:5000/api/books?category=Epic%20Literature&limit=4');
      setRecommendations(recRes.data.slice(0, 4).map(book => ({
        _id: book._id,
        resourceId: book,
        reason: 'Popular in Epic Literature'
      })));

      // Fetch trending books
      const trendRes = await axios.get('http://localhost:5000/api/books?sortBy=rating&sortOrder=desc&limit=5');
      setTrending(trendRes.data.slice(0, 3));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/downloads')}>
          <h3 className="text-lg font-semibold mb-2">Downloads This Month</h3>
          <p className="text-3xl font-bold text-primary">{stats.downloadsThisMonth}</p>
        </div>
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/bookmarks')}>
          <h3 className="text-lg font-semibold mb-2">Bookmarks</h3>
          <p className="text-3xl font-bold text-accent">{stats.bookmarksCount}</p>
        </div>
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/reading-history')}>
          <h3 className="text-lg font-semibold mb-2">Reading Time (min)</h3>
          <p className="text-3xl font-bold text-secondary">{stats.totalReadingTime}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recently Accessed</h3>
          <ul className="space-y-2">
            {recentResources.map((resource) => (
              <li key={resource._id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate(`/reader/${resource._id}`)}>
                <span>{resource.title}</span>
                <span className="text-sm text-gray-500">{resource.author}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Recommended for You</h3>
          <ul className="space-y-2">
            {recommendations.map((rec) => (
              <li key={rec._id} className="flex justify-between items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={() => navigate(`/reader/${rec.resourceId?._id}`)}>
                <span>{rec.resourceId?.title}</span>
                <span className="text-sm text-accent">{rec.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Trending in Your Department</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trending.map((trend) => (
            <div key={trend._id} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/reader/${trend._id}`)}>
              <h4 className="font-semibold">{trend.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{trend.author}</p>
              <p className="text-xs text-accent mt-2">Trending</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
