import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar, Star, User, Eye, Trash2 } from 'lucide-react';

const BooksList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        ...filters
      };
      const response = await booksAPI.getBooks(params);
      setBooks(response.data.books);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const handleSearch = () => {
    fetchBooks(1);
  };

  const handleNextPage = () => {
    if (pagination.hasNext) {
      fetchBooks(pagination.currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagination.hasPrev) {
      fetchBooks(pagination.currentPage - 1);
    }
  };

  const handleDeleteBook = async (bookId) => {
    console.log('Delete button clicked for book:', bookId);
    console.log('Current user:', user);
    if (window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
      try {
        await booksAPI.deleteBook(bookId);
        // Refresh the books list
        fetchBooks(pagination.currentPage);
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Failed to delete book. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Reviews</h1>
        <p className="text-gray-600">Discover and review amazing books from our community</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search books..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Biography">Biography</option>
              <option value="History">History</option>
              <option value="Self-Help">Self-Help</option>
            </select>
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Newest First</option>
            <option value="title">Title A-Z</option>
            <option value="author">Author A-Z</option>
            <option value="year">Year</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {books.map((book) => {
          console.log('Book data:', book);
          console.log('Book addedBy:', book.addedBy);
          return (
          <div key={book._id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">by <span className="font-medium">{book.author}</span></p>
              <p className="text-sm text-gray-500 mb-2">{book.description.substring(0, 100)}...</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {book.genre}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {book.year}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {book.addedBy?.name}
                </span>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/book/${book._id}`}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                  >
                    View Details
                    <Eye className="h-4 w-4 ml-1" />
                  </Link>
                  {user && (
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="text-red-600 hover:text-red-700 flex items-center text-sm"
                      title="Delete book"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Pagination */}
      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found</p>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNext}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BooksList;
