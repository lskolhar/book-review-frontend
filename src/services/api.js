import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '') + '/api';

console.log('API Base URL:', API_BASE_URL);
console.log('Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url, 'Method:', config.method);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data, error.config?.url);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Books API calls
export const booksAPI = {
  getBooks: (params = {}) => api.get('/books', { params }),
  getBookById: (id) => api.get(`/books/${id}`),
  addBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

// Reviews API calls
export const reviewsAPI = {
  getBookReviews: (bookId) => api.get(`/reviews/book/${bookId}`),
  getUserReviews: () => api.get('/reviews/user'),
  addReview: (bookId, reviewData) => api.post(`/reviews/book/${bookId}`, reviewData),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export default api;
