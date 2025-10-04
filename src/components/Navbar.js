import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, BookOpen, Plus, Home } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600">
            <BookOpen className="h-8 w-8" />
            <span>BookReviews</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/add-book" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>Add Book</span>
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
