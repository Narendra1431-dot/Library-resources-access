import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetail = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isBorrowed, setIsBorrowed] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    fetchBookDetails();
    fetchUserProfile();
  }, [bookId]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/books/${bookId}`);
      setBook(response.data.book);
      setRelatedBooks(response.data.relatedBooks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book details:', error);
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5000/api/auth/profile', config);
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleBorrow = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/books/${bookId}/borrow`, {}, config);
      alert('Book borrowed successfully!');
      fetchBookDetails(); // Refresh book data
    } catch (error) {
      alert('Error borrowing book: ' + error.response?.data?.error || error.message);
    }
  };

  const handleReturn = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/books/${bookId}/return`, {}, config);
      alert('Book returned successfully!');
      fetchBookDetails(); // Refresh book data
    } catch (error) {
      alert('Error returning book: ' + error.response?.data?.error || error.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading book details...</div>;
  if (!book) return <div className="text-center py-8">Book not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3">
          <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-gray-500 text-lg">No Cover Image</span>
            )}
          </div>
          <div className="space-y-3">
            {user && (
              <>
                {book.availableCopies > 0 ? (
                  <button
                    onClick={handleBorrow}
                    className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Borrow Book
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-400 text-white py-3 px-4 rounded-lg cursor-not-allowed"
                  >
                    Currently Unavailable
                  </button>
                )}
                {isBorrowed && (
                  <button
                    onClick={handleReturn}
                    className="w-full bg-accent text-white py-3 px-4 rounded-lg hover:bg-accent-dark transition-colors"
                  >
                    Return Book
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="lg:w-2/3 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            {book.subtitle && <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">{book.subtitle}</h2>}
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">by {book.author}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">{book.category}</span>
              <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">{book.department}</span>
              <span className="bg-accent text-white px-3 py-1 rounded-full text-sm">{book.difficultyLevel}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{book.totalPages}</p>
              <p className="text-sm text-gray-600">Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">{book.durationMinutes}</p>
              <p className="text-sm text-gray-600">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{book.rating.toFixed(1)}</p>
              <p className="text-sm text-gray-600">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{book.availableCopies}</p>
              <p className="text-sm text-gray-600">Available</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Book Details</h3>
              <div className="space-y-2">
                <p><strong>ISBN:</strong> {book.isbn}</p>
                <p><strong>Publisher:</strong> {book.publisher}</p>
                <p><strong>Publication Year:</strong> {book.publicationYear}</p>
                <p><strong>Language:</strong> {book.language}</p>
                <p><strong>Format:</strong> {book.format.join(', ')}</p>
                <p><strong>Era:</strong> {book.era}</p>
                <p><strong>Origin:</strong> {book.origin}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Info</h3>
              <div className="space-y-2">
                <p><strong>Edition:</strong> {book.edition || 'N/A'}</p>
                <p><strong>Total Copies:</strong> {book.totalCopies}</p>
                <p><strong>Shelf Location:</strong> {book.shelfLocation || 'N/A'}</p>
                <p><strong>Views:</strong> {book.totalViews}</p>
                <p><strong>Downloads:</strong> {book.totalDownloads}</p>
              </div>
            </div>
          </div>

          {book.keyTopics && book.keyTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {book.keyTopics.map((topic, index) => (
                  <span key={index} className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {relatedBooks.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Related Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedBooks.map((relatedBook) => (
              <div
                key={relatedBook.bookId}
                className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/books/${relatedBook.bookId}`)}
              >
                <div className="aspect-w-3 aspect-h-4 bg-gray-200 rounded mb-2 flex items-center justify-center">
                  {relatedBook.coverImage ? (
                    <img src={relatedBook.coverImage} alt={relatedBook.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <span className="text-gray-500 text-xs">No Cover</span>
                  )}
                </div>
                <h4 className="font-semibold text-sm mb-1 line-clamp-2">{relatedBook.title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">{relatedBook.author}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
