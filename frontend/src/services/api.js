import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Token management
const getToken = () => localStorage.getItem('admin_token');
const setToken = (token) => localStorage.setItem('admin_token', token);
const removeToken = () => localStorage.removeItem('admin_token');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      // Redirect to login if on admin route
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const apiService = {
  // Services
  async getServices() {
    try {
      const response = await api.get('/services');
      return response.data.services;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Pricing
  async getPricing() {
    try {
      const response = await api.get('/pricing');
      return response.data.pricing;
    } catch (error) {
      console.error('Error fetching pricing:', error);
      throw error;
    }
  },

  // Testimonials
  async getTestimonials() {
    try {
      const response = await api.get('/testimonials');
      return response.data.testimonials;
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  // Company Info
  async getCompanyInfo() {
    try {
      const response = await api.get('/company-info');
      return response.data.company;
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  },

  // Contact
  async submitContact(contactData) {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }
};

// Admin API calls
export const adminAPI = {
  // Authentication
  async login(credentials) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
      const { access_token } = response.data;
      setToken(access_token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async verifyToken() {
    try {
      const response = await api.get('/admin/verify');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  },

  logout() {
    removeToken();
  },

  // Services Management
  async getServices() {
    const response = await api.get('/admin/services');
    return response.data.services;
  },

  async createService(serviceData) {
    const response = await api.post('/admin/services', serviceData);
    return response.data;
  },

  async updateService(serviceId, serviceData) {
    const response = await api.put(`/admin/services/${serviceId}`, serviceData);
    return response.data;
  },

  async deleteService(serviceId) {
    const response = await api.delete(`/admin/services/${serviceId}`);
    return response.data;
  },

  // Pricing Management
  async getPricing() {
    const response = await api.get('/admin/pricing');
    return response.data.pricing;
  },

  async createPricing(pricingData) {
    const response = await api.post('/admin/pricing', pricingData);
    return response.data;
  },

  async updatePricing(pricingId, pricingData) {
    const response = await api.put(`/admin/pricing/${pricingId}`, pricingData);
    return response.data;
  },

  async deletePricing(pricingId) {
    const response = await api.delete(`/admin/pricing/${pricingId}`);
    return response.data;
  },

  // Testimonials Management
  async getTestimonials() {
    const response = await api.get('/admin/testimonials');
    return response.data.testimonials;
  },

  async createTestimonial(testimonialData) {
    const response = await api.post('/admin/testimonials', testimonialData);
    return response.data;
  },

  async updateTestimonial(testimonialId, testimonialData) {
    const response = await api.put(`/admin/testimonials/${testimonialId}`, testimonialData);
    return response.data;
  },

  async deleteTestimonial(testimonialId) {
    const response = await api.delete(`/admin/testimonials/${testimonialId}`);
    return response.data;
  },

  // Company Info Management
  async getCompanyInfo() {
    const response = await api.get('/admin/company-info');
    return response.data.company;
  },

  async updateCompanyInfo(companyData) {
    const response = await api.put('/admin/company-info', companyData);
    return response.data;
  },

  // Contacts Management
  async getContacts() {
    const response = await api.get('/admin/contacts');
    return response.data.contacts;
  },

  async updateContactStatus(contactId, status) {
    const response = await api.put(`/admin/contacts/${contactId}/status`, { status });
    return response.data;
  },

  async deleteContact(contactId) {
    const response = await api.delete(`/admin/contacts/${contactId}`);
    return response.data;
  }
};

export { getToken, setToken, removeToken };
export default api;