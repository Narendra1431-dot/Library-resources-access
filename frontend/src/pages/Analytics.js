import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Analytics = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState({
    totalResources: 0,
    totalDownloads: 0,
    totalUsers: 0,
    activeUsers: 0,
    departmentUsage: [],
    mostAccessed: [],
    peakUsage: [],
    categoryDistribution: [],
    userActivity: [],
    resourceTrends: [],
    submissionStats: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const responses = await Promise.all([
        axios.get('http://localhost:5000/api/analytics/total-resources', config),
        axios.get('http://localhost:5000/api/analytics/total-downloads', config),
        axios.get('http://localhost:5000/api/analytics/total-users', config),
        axios.get('http://localhost:5000/api/analytics/active-users', config),
        axios.get('http://localhost:5000/api/analytics/department-usage', config),
        axios.get('http://localhost:5000/api/analytics/most-accessed', config),
        axios.get('http://localhost:5000/api/analytics/peak-usage', config),
        axios.get('http://localhost:5000/api/analytics/category-distribution', config),
        axios.get('http://localhost:5000/api/analytics/user-activity', config),
        axios.get('http://localhost:5000/api/analytics/resource-trends', config),
        axios.get('http://localhost:5000/api/analytics/submission-stats', config)
      ]);

      setAnalytics({
        totalResources: responses[0].data.totalResources,
        totalDownloads: responses[1].data.totalDownloads,
        totalUsers: responses[2].data.totalUsers,
        activeUsers: responses[3].data.activeUsers,
        departmentUsage: responses[4].data,
        mostAccessed: responses[5].data,
        peakUsage: responses[6].data,
        categoryDistribution: responses[7].data,
        userActivity: responses[8].data,
        resourceTrends: responses[9].data,
        submissionStats: responses[10].data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
    setLoading(false);
  };

  const handleResourceClick = (resourceId) => {
    navigate(`/reader/${resourceId}`);
  };

  const handleUserClick = (userId) => {
    // Navigate to user profile or admin user management
    navigate(`/admin/users/${userId}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Resources:</span>
              <span className="font-bold text-primary">{analytics.totalResources}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Downloads:</span>
              <span className="font-bold text-accent">{analytics.totalDownloads}</span>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Department Usage</h3>
          <ul className="space-y-2">
            {analytics.departmentUsage.map((dept) => (
              <li key={dept._id} className="flex justify-between">
                <span>{dept._id}</span>
                <span className="font-semibold">{dept.count} downloads</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Most Accessed Journals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Author</th>
                <th className="text-left p-2">Downloads</th>
              </tr>
            </thead>
            <tbody>
              {analytics.mostAccessed.map((resource) => (
                <tr key={resource._id} className="border-b">
                  <td className="p-2">{resource.title}</td>
                  <td className="p-2">{resource.author}</td>
                  <td className="p-2 font-semibold">{resource.downloads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Peak Usage Time</h3>
          <ul className="space-y-2">
            {analytics.peakUsage.slice(0, 5).map((peak) => (
              <li key={peak._id} className="flex justify-between">
                <span>Hour {peak._id}</span>
                <span className="font-semibold">{peak.count} activities</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Resource Category Distribution</h3>
          <ul className="space-y-2">
            {analytics.categoryDistribution.map((cat) => (
              <li key={cat._id} className="flex justify-between">
                <span>{cat._id}</span>
                <span className="font-semibold">{cat.count} resources</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
