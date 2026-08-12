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
  updateProfile: (profileData) => api.put('/auth/me', profileData),
  toggleWishlist: (equipmentId) => api.post('/auth/wishlist', { equipmentId }),
};

const mapEquipmentItem = (item) => ({
  ...item,
  id: item._id || item.id,
  status: item.status || 'Approved',
  location: item.locationAddress || 'Unknown Location',
  owner: item.ownerId ? {
    id: item.ownerId._id,
    name: item.ownerId.company || item.ownerId.name || 'Unknown Fleet',
    ownerName: item.ownerId.name || 'Unknown Owner',
    phone: item.ownerId.phone || '+1 (555) 000-0000',
    email: item.ownerId.email || 'contact@rentra.com',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150'
  } : { name: 'Unknown Fleet', ownerName: 'Unknown Owner' }
});

const mapEquipmentResponse = (res) => {
  if (res.data && Array.isArray(res.data)) {
    res.data = res.data.map(mapEquipmentItem);
  } else if (res.data) {
    res.data = mapEquipmentItem(res.data);
  }
  return res;
};

export const equipmentService = {
  getAll: (params) => api.get('/equipment', { params }).then(mapEquipmentResponse),
  getBundles: () => api.get('/equipment/bundles'),
  getById: (id) => api.get(`/equipment/${id}`).then(mapEquipmentResponse),
  create: (equipmentData) => api.post('/equipment', equipmentData).then(mapEquipmentResponse),
};

export const bookingService = {
  getAll: () => api.get('/bookings'),
  create: (bookingData) => api.post('/bookings', bookingData),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  submitInspection: (id, data) => api.post(`/bookings/${id}/inspection`, data),
  downloadContractPdf: (id) => api.get(`/bookings/${id}/contract-pdf`, { responseType: 'blob' }),
};

export const escrowService = {
  createStripeIntent: (data) => api.post('/escrow/stripe/create-intent', data),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getBusinesses: () => api.get('/admin/businesses'),
  verifyBusiness: (id, data) => api.put(`/admin/businesses/${id}/verify`, data),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getBookings: () => api.get('/admin/bookings'),
  deleteEquipment: (id) => api.delete(`/admin/equipment/${id}`),
};

export const mediaService = {
  uploadPhoto: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export default api;
