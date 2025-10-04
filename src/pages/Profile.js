import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { booksAPI, reviewsAPI } from '../services/api';
import { User, BookOpen, Star, Calendar, Trash2, Edit, Eye } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [userBooks, setUserBooks] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [isAuthenticated, navigate, fetchUserData]);

  const fetchUserData = useCallback(async () => {
    try {
      // Fetch user's books (we'll need to add this endpoint to the backend)
      const booksResponse = await booksAPI.getBooks(); // This needs filtering by user
      const userBooksFiltered = booksResponse.data.books.filter(
        book => book.addedBy._id === user._id
      );
      setUserBooks(userBooksFiltered);

      // Fetch user's reviews
      const reviewsResponse = await reviewsAPI.getUserReviews();
      setUserReviews(reviewsResponse.data.reviews);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [user._id]);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await booksAPI.deleteBook(bookId);
      setUserBooks(userBooks.filter(book => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewsAPI.deleteReview(reviewId);
      setUserReviews(userReviews.filter(review => review._id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* User Profile Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Books Added</p>
                <p className="text-2xl font-bold text-blue-900">{userBooks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <Star className="h-6 w-6 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Reviews Written</p>
                <p className="text-2xl font-bold text-green-900">{userReviews.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Books */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Books</h2>
          {userBooks.length === 0 && (
            <button
              onClick={() => navigate('/add-book')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Your First Book
            </button>
          )}
        </div>

        {userBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No books added yet</p>
            <p className="text-gray-400">Start by adding books to share with the community</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userBooks.map((book) => (
              <div key={book._id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-gray-600 mb-2">by {book.author}</p>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                      {book.genre}
                    </span>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Published: {book.year}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                  {book.description}
                </p>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/book/${book._id}`)}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/edit-book/${book._id}`)}
                      className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book._id)}
                      className="flex items-center px-3 py-1 border border-red-300 text-red-700 rounded text-sm hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User's Reviews */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2>

        {userReviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No reviews written yet</p>
            <p className="text-gray-400">Start reviewing books you've read</p>
          </div>
        ) : (
          <div className="space-y-6">
            {userReviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {review.bookId?.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">by {review.bookId?.author}</p>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-gray-700 mb-2">{review.reviewText}</p>
                <p className="text-sm text-gray-500">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
