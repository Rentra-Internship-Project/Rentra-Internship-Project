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
      localStorage.removeItem('rentra_token');
      // Use window.location to force a full reload and clear React state
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?error=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  updatePassword: (data) => api.put('/auth/me/password', data),
  toggleWishlist: (equipmentId) => api.post('/auth/wishlist', { equipmentId }),
  getWishlist: () => api.get('/auth/wishlist'),
};

// ─── Equipment Mapping ────────────────────────────────────────────────────────
const mapEquipmentItem = (item) => ({
  ...item,
  id: item._id || item.id,
  // Do NOT fake status — use real status from DB
  location: item.locationAddress || item.location || 'Location not specified',
  owner: item.ownerId
    ? {
        id: item.ownerId._id || item.ownerId.id,
        name: item.ownerId.name || 'Unknown Owner',
        phone: item.ownerId.phone || '',
        email: item.ownerId.email || '',
        avatar: item.ownerId.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150',
      }
    : { name: 'Unknown Owner', phone: '', email: '' },
  businessName: item.businessId?.businessName || '',
  rating: item.rating || 0,
  reviewsCount: item.reviewsCount || 0,
});

const mapEquipmentResponse = (res) => {
  if (res.data && Array.isArray(res.data)) {
    res.data = res.data.map(mapEquipmentItem);
  } else if (res.data && res.data.equipment) {
    res.data.equipment = Array.isArray(res.data.equipment)
      ? res.data.equipment.map(mapEquipmentItem)
      : mapEquipmentItem(res.data.equipment);
  } else if (res.data && res.data._id) {
    res.data = mapEquipmentItem(res.data);
  }
  return res;
};

// ─── Equipment Service ────────────────────────────────────────────────────────
export const equipmentService = {
  // Public: only Approved + Available (backend filters)
  getAll: (params) => api.get('/equipment', { params }).then(mapEquipmentResponse),
  getBundles: () => api.get('/equipment/bundles'),
  getById: (id) => api.get(`/equipment/${id}`).then(mapEquipmentResponse),
  getEquipmentReviews: (id) => api.get(`/equipment/${id}/reviews`),
  // Owner: all their equipment (all statuses)
  getMyEquipment: () => api.get('/equipment/my').then(mapEquipmentResponse),
  create: (equipmentData) => api.post('/equipment', equipmentData).then(mapEquipmentResponse),
  update: (id, data) => api.put(`/equipment/${id}`, data).then(mapEquipmentResponse),
  delete: (id) => api.delete(`/equipment/${id}`),
};

// ─── Booking Service ──────────────────────────────────────────────────────────
export const bookingService = {
  // Customer's own bookings
  getMyBookings: () => api.get('/bookings/my'),
  // Owner's equipment bookings
  getOwnerBookings: () => api.get('/bookings/owner'),
  // Create a new booking (customer only)
  create: (bookingData) => api.post('/bookings', bookingData),
  // Update status (role-based transitions validated server-side)
  updateStatus: (id, status, extra) => api.put(`/bookings/${id}/status`, { status, ...extra }),
  // Confirm deposit after Razorpay payment
  confirmDeposit: (id, paymentData) => api.post(`/bookings/${id}/deposit`, paymentData),
  submitInspection: (id, data) => api.post(`/bookings/${id}/inspection`, data),
  downloadContractPdf: (id) => api.get(`/bookings/${id}/contract-pdf`, { responseType: 'blob' }),
  rateBooking: (id, rating, review) => api.post(`/bookings/${id}/rate`, { rating, review }),
};

// ─── Business Service ─────────────────────────────────────────────────────────
export const businessService = {
  register: (data) => api.post('/business', data),
  getMyBusiness: () => api.get('/business/me'),
  update: (data) => api.put('/business/me', data),
};

// ─── Category Service ─────────────────────────────────────────────────────────
export const categoryService = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Notification Service ─────────────────────────────────────────────────────
export const notificationService = {
  getAll: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
};

// ─── Chat Service ─────────────────────────────────────────────────────────────
export const chatService = {
  sendMessage: (messages) => api.post('/chat', { messages }),
};

// ─── Razorpay Service ─────────────────────────────────────────────────────────
export const razorpayService = {
  createOrder: (bookingId) => api.post('/razorpay/create-order', { bookingId }),
  verifyPayment: (paymentData) => api.post('/razorpay/verify-payment', paymentData),
};

// ─── Admin Service ────────────────────────────────────────────────────────────
export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getBusinesses: () => api.get('/admin/businesses'),
  verifyBusiness: (id, data) => api.put(`/admin/businesses/${id}/verify`, data),
  deleteBusiness: (id) => api.delete(`/admin/businesses/${id}`),
  getEquipment: () => api.get('/admin/equipment').then(mapEquipmentResponse),
  approveEquipment: (id, data) => api.put(`/admin/equipment/${id}/approve`, data),
  rejectEquipment: (id, data) => api.put(`/admin/equipment/${id}/reject`, data),
  deleteEquipment: (id) => api.delete(`/admin/equipment/${id}`),
  getUsers: () => api.get('/admin/users'),
  getUserDetails: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getBookings: () => api.get('/admin/bookings'),
};

// ─── Media Service ────────────────────────────────────────────────────────────
export const mediaService = {
  uploadPhoto: (formData) =>
    api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default api;
