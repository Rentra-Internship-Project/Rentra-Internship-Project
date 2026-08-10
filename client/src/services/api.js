import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create Axios Instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rentra_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Unauthorized Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('⚠️ Session expired or unauthorized access.');
    }
    return Promise.reject(error);
  }
);

// API Service Wrapper Methods
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export const equipmentService = {
  getAll: (params) => api.get('/equipment', { params }),
  getBundles: () => api.get('/equipment/bundles'),
  getById: (id) => api.get(`/equipment/${id}`),
  create: (equipmentData) => api.post('/equipment', equipmentData),
};

export const bookingService = {
  getAll: () => api.get('/bookings'),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  submitInspection: (id, data) => api.post(`/bookings/${id}/inspection`, data),
  downloadContractPdf: (id) => api.get(`/bookings/${id}/contract-pdf`, { responseType: 'blob' }),
};

export const escrowService = {
  createRazorpayOrder: (data) => api.post('/escrow/razorpay/create-order', data),
  createStripeIntent: (data) => api.post('/escrow/stripe/create-intent', data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getBusinesses: () => api.get('/admin/businesses'),
  verifyBusiness: (id, data) => api.put(`/admin/businesses/${id}/verify`, data),
};

export const mediaService = {
  uploadPhoto: (data) => api.post('/upload', data),
};

export default api;
