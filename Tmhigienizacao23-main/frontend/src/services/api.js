import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions for TM Higienização
export const apiService = {
  // Get all services
  getServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data.services || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  // Get pricing categories
  getPricing: async () => {
    try {
      const response = await api.get('/pricing');
      return response.data.pricing || [];
    } catch (error) {
      console.error('Error fetching pricing:', error);
      throw error;
    }
  },

  // Get testimonials
  getTestimonials: async () => {
    try {
      const response = await api.get('/testimonials');
      return response.data.testimonials || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      throw error;
    }
  },

  // Get company information
  getCompanyInfo: async () => {
    try {
      const response = await api.get('/company-info');
      return response.data.company || {};
    } catch (error) {
      console.error('Error fetching company info:', error);
      throw error;
    }
  },

  // Submit contact form
  submitContact: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
};

export default apiService;