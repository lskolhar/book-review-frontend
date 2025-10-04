import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import BooksList from './pages/BooksList';
import BookDetails from './pages/BookDetails';
import AddEditBook from './pages/AddEditBook';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Main App Content
const AppContent = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={isAuthenticated ? <BooksList /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route 
            path="/add-book" 
            element={
              <ProtectedRoute>
                <AddEditBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-book/:id" 
            element={
              <ProtectedRoute>
                <AddEditBook />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer - only show on main app pages */}
      {isAuthenticated && (
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 Book Reviews Platform. Made with ❤️ for book lovers.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
