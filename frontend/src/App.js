import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Reader from './pages/Reader';
import Analytics from './pages/Analytics';
import Submissions from './pages/Submissions';
import Downloads from './pages/Downloads';
import Bookmarks from './pages/Bookmarks';
import ReadingHistory from './pages/ReadingHistory';
import History from './pages/History';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Fetch user profile
    }
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      {isAuthenticated ? (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header user={user} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
            <main className="flex-1 p-6 bg-light dark:bg-dark animate-fade-in">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/search" element={<Search />} />
                <Route path="/reader/:id" element={<Reader />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/submissions" element={<Submissions />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/reading-history" element={<ReadingHistory />} />
                <Route path="/books" element={<Books />} />
                <Route path="/books/:bookId" element={<BookDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
