import React from 'react';

const Header = ({ user, toggleDarkMode, darkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Welcome back, {user?.name || 'User'}!</h2>
        <span className="bg-primary text-white px-2 py-1 rounded text-sm">{user?.role}</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center space-x-2">
          <span>Downloads: {user?.downloadsThisMonth || 0}/{user?.downloadLimit || 10}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
