import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    accessType: '',
    sortBy: 'relevance'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popularSearches, setPopularSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = { search: query, ...filters };
      const response = await axios.get('http://localhost:5000/api/resources', { params });
      setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSearchData();
  }, []);

  useEffect(() => {
    if (query || Object.values(filters).some(v => v)) {
      handleSearch();
    }
  }, [filters]);

  const fetchSearchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch popular searches
      const popularRes = await axios.get('http://localhost:5000/api/resources/popular-searches', config);
      setPopularSearches(popularRes.data);

      // Fetch recent searches
      const recentRes = await axios.get('http://localhost:5000/api/resources/recent-searches', config);
      setRecentSearches(recentRes.data);

      // Fetch trending topics
      const trendingRes = await axios.get('http://localhost:5000/api/resources/trending-topics', config);
      setTrendingTopics(trendingRes.data);
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResourceClick = (resourceId) => {
    navigate(`/reader/${resourceId}`);
  };

  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    setFilters({ department: '', year: '', accessType: '', sortBy: 'relevance' });
  };

  return (
    <div className="space-y-6">
      {/* Quick Search Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
          <div className="space-y-2">
            {popularSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(search.query)}
                className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <span className="text-sm">{search.query}</span>
                <span className="text-xs text-gray-500 ml-2">({search.count} searches)</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Recent Searches</h3>
          <div className="space-y-2">
            {recentSearches.slice(0, 5).map((search, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(search.query)}
                className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <span className="text-sm">{search.query}</span>
                <span className="text-xs text-gray-500 ml-2">
                  {new Date(search.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Trending Topics</h3>
          <div className="space-y-2">
            {trendingTopics.slice(0, 5).map((topic, index) => (
              <button
                key={index}
                onClick={() => handleQuickSearch(topic.topic)}
                className="w-full text-left p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <span className="text-sm">{topic.topic}</span>
                <span className="text-xs text-accent ml-2">🔥 {topic.trend}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Search */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Advanced Search</h2>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by title, author, subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
          </select>
          <select
            value={filters.year}
            onChange={(e) => handleFilterChange('year', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Years</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
          <select
            value={filters.accessType}
            onChange={(e) => handleFilterChange('accessType', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Access Types</option>
            <option value="free">Free</option>
            <option value="subscription">Subscription</option>
          </select>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="p-2 border rounded"
          >
            <option value="relevance">Relevance</option>
            <option value="downloads">Downloads</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Search Results ({results.length})</h3>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Searching...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((resource) => (
              <div key={resource._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleResourceClick(resource._id)}>
                <h4 className="font-semibold text-lg">{resource.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{resource.author}</p>
                <p className="text-sm mt-2">{resource.description}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className={`px-2 py-1 rounded text-xs ${resource.accessType === 'free' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {resource.accessType}
                  </span>
                  <span className="text-sm text-gray-500">Downloads: {resource.downloads}</span>
                </div>
                <button className="w-full mt-4 bg-primary text-white py-2 rounded hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
