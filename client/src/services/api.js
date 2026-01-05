import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Ticket services
export const ticketService = {
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  getMyTickets: async () => {
    const response = await api.get('/tickets/my');
    return response.data;
  },

  getAllTickets: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tickets?${params}`);
    return response.data;
  },

  getTicket: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  updateStatus: async (id, statusData) => {
    const response = await api.put(`/tickets/${id}/status`, statusData);
    return response.data;
  },

  assignTicket: async (id, agentId) => {
    const response = await api.put(`/tickets/${id}/assign`, { assignedTo: agentId });
    return response.data;
  },

  addComment: async (id, text) => {
    const response = await api.post(`/tickets/${id}/comments`, { text });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/tickets/stats');
    return response.data;
  }
};

// Knowledge base services
export const knowledgeService = {
  searchKnowledge: async (query) => {
    const response = await api.get(`/knowledge/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  getAllArticles: async () => {
    const response = await api.get('/knowledge');
    return response.data;
  },

  getArticle: async (id) => {
    const response = await api.get(`/knowledge/${id}`);
    return response.data;
  },

  articleFeedback: async (id, helpful) => {
    const response = await api.post(`/knowledge/${id}/feedback`, { helpful });
    return response.data;
  }
};

// User services
export const userService = {
  getAgents: async () => {
    const response = await api.get('/users/agents');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  }
};

export default api;
