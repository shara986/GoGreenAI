import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gogreen_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle common HTTP error statuses cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error("Unable to connect to the server. Please try again."));
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    if (status === 401) {
      localStorage.removeItem('gogreen_token');
      localStorage.removeItem('gogreen_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(new Error(serverMessage || "Your session has expired. Please login again."));
    }

    if (status === 403) {
      return Promise.reject(new Error(serverMessage || "You do not have permission to access this section."));
    }

    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }

    return Promise.reject(error);
  }
);

export default apiClient;
