import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    era: '',
    origin: '',
    category: ''
  });

  const categories = [
    'Epic Literature',
    'Ancient India',
    'Medieval India',
    'Freedom Struggle',
    'Indian Philosophy',
    'World History'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [books, searchTerm, filters]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history books:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = books;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Era filter
    if (filters.era) {
      filtered = filtered.filter(book => book.era === filters.era);
    }

    // Origin filter
    if (filters.origin) {
      filtered = filtered.filter(book => book.origin === filters.origin);
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(book => book.category === filters.category);
    }

    setFilteredBooks(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({ era: '', origin: '', category: '' });
    setSearchTerm('');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-400 mb-2">History & Heritage</h1>
        <p className="text-gray-600 dark:text-gray-400">Explore India's rich historical and philosophical heritage</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800"
          />

          <select
            value={filters.era}
            onChange={(e) => handleFilterChange('era', e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800"
          >
            <option value="">All Eras</option>
            <option value="Ancient">Ancient</option>
            <option value="Medieval">Medieval</option>
            <option value="Modern">Modern</option>
          </select>

          <select
            value={filters.origin}
            onChange={(e) => handleFilterChange('origin', e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800"
          >
            <option value="">All Origins</option>
            <option value="India">India</option>
            <option value="World">World</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white dark:bg-gray-800"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Clear Filters
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredBooks.length} books found
          </span>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleFilterChange('category', category)}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
              filters.category === category
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400'
                : 'border-amber-200 dark:border-amber-800 hover:border-amber-400 text-gray-700 dark:text-gray-300'
            }`}
          >
            <h3 className="font-semibold text-sm">{category}</h3>
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book._id}
            onClick={() => navigate(`/resource/${book._id}`)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-amber-100 dark:border-amber-900 overflow-hidden group"
          >
            <div className="h-48 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
              {book.coverImage ? (
                <img src={`http://localhost:5000/${book.coverImage}`} alt={book.title} className="h-full w-full object-cover" />
              ) : (
                <div className="text-6xl">📚</div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-xs rounded-full">
                  {book.era}
                </span>
                <span className="px-2 py-1 bg-maroon-100 dark:bg-maroon-900 text-maroon-800 dark:text-maroon-200 text-xs rounded-full">
                  {book.origin}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{book.category}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{book.description}</p>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">{book.language}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  book.availability
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {book.availability ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No books found</h3>
          <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default History;
