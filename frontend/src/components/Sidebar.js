import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '🏠', action: () => navigate('/') },
    { path: '/search', label: 'Search', icon: '🔍', action: () => navigate('/search') },
    { path: '/books', label: 'Books', icon: '📚', action: () => navigate('/books') },
    { path: '/history', label: 'History & Heritage', icon: '📜', action: () => navigate('/history') },
    { path: '/analytics', label: 'Analytics', icon: '📊', action: () => navigate('/analytics') },
    { path: '/submissions', label: 'Submissions', icon: '📝', action: () => navigate('/submissions') },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 w-64 h-full shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">Library Hub</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <div
            key={item.path}
            onClick={item.action}
            className={`flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
              location.pathname === item.path ? 'bg-primary text-white' : ''
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
