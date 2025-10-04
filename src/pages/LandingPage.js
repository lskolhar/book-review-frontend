import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Review</h1>
          <p className="text-gray-600">Welcome to our book review platform</p>
        </div>

        {/* Login Credentials Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Demo Login Credentials</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-mono text-blue-800">abcd@gmail.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Password:</span>
              <span className="font-mono text-blue-800">12345678</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Or create a new account using the register button below
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-6">
          <button
            onClick={handleLoginClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </button>
          
          <button
            onClick={handleRegisterClick}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Register</span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Book Review Platform - MERN Stack</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
