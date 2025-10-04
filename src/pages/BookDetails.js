import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { booksAPI, reviewsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Calendar, User, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewText: ''
  });
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchBookDetails = async () => {
    try {
      const response = await booksAPI.getBookById(id);
      setBook(response.data.book);
    } catch (error) {
      console.error('Error fetching book:', error);
      navigate('/');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getBookReviews(id);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBookDetails(), fetchReviews()]);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setReviewLoading(true);
    try {
      await reviewsAPI.addReview(id, newReview);
      setNewReview({ rating: 0, reviewText: '' });
      fetchReviews(); // Refresh reviews
      fetchBookDetails(); // Refresh book data
    } catch (error) {
      console.error('Error adding review:', error);
      alert(error.response?.data?.message || 'Failed to add review');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await reviewsAPI.deleteReview(reviewId);
      fetchReviews(); // Refresh reviews
      fetchBookDetails(); // Refresh book data
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;

    try {
      await booksAPI.deleteBook(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Book not found</p>
      </div>
    );
  }

  const canEditBook = isAuthenticated && book.addedBy?._id === user?._id;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Books
      </button>

      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            <div className="flex items-center space-x-6 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {book.genre}
              </span>
              <span className="text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Published: {book.year}
              </span>
              <span className="text-gray-600 flex items-center">
                <User className="h-4 w-4 mr-1" />
                Added by: {book.addedBy?.name}
              </span>
            </div>
          </div>

          {canEditBook && (
            <div className="flex space-x-2">
              <button
                onClick={() => navigate(`/edit-book/${book._id}`)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={handleDeleteBook}
                className="flex items-center px-3 py-2 border border-red-300 text-red-700 rounded-md text-sm hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-gray-700 leading-relaxed">{book.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xlfont-bold text-gray-900">Reviews</h2>
          {isAuthenticated && (
            <button
              onClick={() => document.getElementById('review-form').scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Write Review
            </button>
          )}
        </div>

        {/* Add Review Form */}
        {isAuthenticated && (
          <div id="review-form" className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className={`text-2xl ${
                        star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
                  Review
                </label>
                <textarea
                  id="reviewText"
                  value={newReview.reviewText}
                  onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Share your thoughts about this book..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading || newReview.rating === 0 || !newReview.reviewText.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to write one!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userId?.name}</p>
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
                  </div>
                  
                  {isAuthenticated && review.userId._id === user?._id && (
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <p className="text-gray-700">{review.reviewText}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;