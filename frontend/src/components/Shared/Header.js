// src/components/Shared/Header.js
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBell, FaUserCircle, FaSignOutAlt, FaCog, FaBars } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Header = ({ setSidebarOpen }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 bg-white shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-gray-500 lg:hidden focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-md p-1"
          aria-controls="sidebar"
        >
          <FaBars className="w-6 h-6" />
        </button>

        {/* This empty div will push the right-side items to the end on desktop */}
        <div className="hidden lg:block"></div>

        <div className="flex items-center space-x-4">
          {/* Notification Button (Disabled) */}
          <button 
            className="relative p-2 text-gray-400 rounded-full cursor-not-allowed focus:outline-none"
            disabled
            title="Notifications (coming soon)"
          >
            <FaBell className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 rounded-full"
            >
              <FaUserCircle className="w-9 h-9 text-gray-600" />
              {user && (
                <span className="hidden text-sm font-semibold text-gray-700 md:block">
                  {user.username || user.name}
                </span>
              )}
            </button>
            <div
              className={`absolute right-0 w-48 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out ${
                isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}
            >
              <div className="p-1">
                <div className="px-3 py-2 border-b">
                    <p className="text-sm font-semibold text-gray-800">{user?.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center w-full px-3 py-2 mt-1 text-sm text-left text-gray-700 rounded-md hover:bg-gray-100"
                >
                  <FaCog className="w-4 h-4 mr-2 text-gray-500" />
                  Profile
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 rounded-md hover:bg-red-50"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
