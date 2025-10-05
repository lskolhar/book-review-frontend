import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { booksAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, Calendar, User, Eye, Trash2 } from 'lucide-react';

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
  }, [filters]);

  const handleFilterChange = (key, value) => {
    if (key === 'sortBy') {
      // Set appropriate sort order based on sort field
      let sortOrder = 'desc'; // default for createdAt only
      if (value === 'title' || value === 'author' || value === 'year') {
        sortOrder = 'asc'; // A-Z for title and author, oldest to newest for year
      }
      
      setFilters({
        ...filters,
        [key]: value,
        sortOrder: sortOrder
      });
    } else {
      setFilters({
        ...filters,
        [key]: value
      });
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Book Reviews</h1>
          <p className="text-gray-600 text-lg">Discover and review amazing books from our community</p>
        </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search books by title, author, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 bg-white relative z-0"
              style={{ paddingLeft: '3rem' }}
            />
          </div>
          
          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Genre Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
              <select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 relative z-0"
                style={{ paddingLeft: '2.5rem' }}
              >
                <option value="">All Genres</option>              
                <option value="Science Fiction">Science Fiction</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Self-Help">Self-Help</option>
                <option value="Thriller">Thriller</option>
                <option value="Horror">Horror</option>
                <option value="Poetry">Poetry</option>
                <option value="Drama">Drama</option>
                <option value="Adventure">Adventure</option>
                <option value="Comedy">Comedy</option>
              </select>
            </div>

            {/* Sort Filter */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="createdAt">Newest First</option>
              <option value="title">Title A-Z</option>
              <option value="author">Author A-Z</option>
              <option value="year">Year</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
            >
              Search Books
            </button>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {books.map((book) => {
          console.log('Book data:', book);
          console.log('Book addedBy:', book.addedBy);
          return (
          <div key={book._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
            <div className="p-6">
              {/* Book Title and Author */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {book.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  by <span className="font-medium text-gray-800">{book.author}</span>
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">
                {book.description.substring(0, 120)}...
              </p>
              
              {/* Genre and Year */}
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">
                  {book.genre}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {book.year}
                </span>
              </div>

              {/* Added By and Actions */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="truncate">{book.addedBy?.name || 'Unknown'}</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Link
                    to={`/book/${book._id}`}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Link>
                  {user && (
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="text-red-500 hover:text-red-600 p-1 rounded-md hover:bg-red-50 transition-all duration-200"
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
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or add a new book</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePrevPage}
              disabled={!pagination.hasPrev}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700 font-medium">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <span className="text-xs text-gray-500">
                ({pagination.totalBooks || 0} books total)
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={!pagination.hasNext}
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooksList;
