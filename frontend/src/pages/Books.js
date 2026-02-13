import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Books = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    category: '',
    era: '',
    language: '',
    rating: '',
    availability: '',
    format: '',
    difficultyLevel: '',
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:5000/api/books?${params}`);
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      department: '',
      category: '',
      era: '',
      language: '',
      rating: '',
      availability: '',
      format: '',
      difficultyLevel: '',
      sortBy: 'title',
      sortOrder: 'asc'
    });
  };

  if (loading) return <div className="text-center py-8">Loading books...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Books Collection</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search books..."
              value={filters.search}
              onChange={handleFilterChange}
              className="border rounded px-3 py-2"
            />
            <select name="department" value={filters.department} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
            </select>
            <select name="category" value={filters.category} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Categories</option>
              <option value="Epic Literature">Epic Literature</option>
              <option value="Ancient India">Ancient India</option>
              <option value="Medieval India">Medieval India</option>
              <option value="Freedom Struggle">Freedom Struggle</option>
              <option value="Indian Philosophy">Indian Philosophy</option>
              <option value="World History">World History</option>
            </select>
            <select name="era" value={filters.era} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Eras</option>
              <option value="Ancient">Ancient</option>
              <option value="Medieval">Medieval</option>
              <option value="Modern">Modern</option>
            </select>
            <select name="language" value={filters.language} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Languages</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>
            <select name="difficultyLevel" value={filters.difficultyLevel} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select name="availability" value={filters.availability} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
            </select>
            <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="publicationYear">Publication Year</option>
              <option value="rating">Rating</option>
            </select>
            <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange} className="border rounded px-3 py-2">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div className="mt-4">
            <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          'Epic Literature',
          'Ancient India',
          'Medieval India',
          'Freedom Struggle',
          'Indian Philosophy',
          'World History'
        ].map(category => (
          <button
            key={category}
            onClick={() => setFilters(prev => ({ ...prev, category: category === filters.category ? '' : category }))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div
            key={book.bookId}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/books/${book.bookId}`)}
          >
            <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded mb-3 flex items-center justify-center">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded" />
              ) : (
                <span className="text-gray-500">No Cover</span>
              )}
            </div>
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">by {book.author}</p>
            <p className="text-xs text-accent mb-2">{book.category} • {book.department}</p>
            <div className="flex justify-between items-center text-sm">
              <span className={`px-2 py-1 rounded text-xs ${
                book.availableCopies > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {book.availableCopies > 0 ? 'Available' : 'Issued'}
              </span>
              <span className="text-yellow-500">★ {book.rating.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No books found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Books;
