import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  signup: async (data: { phoneNumber: string; name: string; email: string; password: string }) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, data)
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  }
}

export const collectorService = {
  getCollectors: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/collectors`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  approvePendingCollector: async (email: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_BASE_URL}/collectors/approve`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  rejectPendingCollector: async (email: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_BASE_URL}/collectors/reject`, { email }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

export const eventService = {
  getEvents: async () => {
    const response = await axios.get(`${API_BASE_URL}/events`)
    return response.data
  },

  createEvent: async (eventName: string, eventDate: string, eventTime: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_BASE_URL}/events`, { eventName, eventDate, eventTime }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  respondToEvent: async (eventId: string, status: 'approved' | 'rejected' | 'pending') => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_BASE_URL}/events/${eventId}/respond`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getUserEventStatus: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/events/user/status`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  deleteEvent: async (eventId: string) => {
    const token = localStorage.getItem('token')
    const response = await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  setDateAvailability: async (date: string, status: 'approved' | 'rejected' | 'pending') => {
    const token = localStorage.getItem('token')
    const response = await axios.post(`${API_BASE_URL}/events/availability/set`, { date, status }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getUserDateAvailability: async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/events/availability/user`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getAllDateAvailability: async () => {
    const response = await axios.get(`${API_BASE_URL}/events/availability/all`)
    return response.data
  }
}
