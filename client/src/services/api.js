import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || ''

// Helper to get auth header
const getAuthHeader = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {}
}

// Generic fetch wrapper
const apiFetch = async (endpoint, options = {}) => {
  const authHeader = await getAuthHeader()

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return response.json()
}

// Auth API
export const authApi = {
  getProfile: () => apiFetch('/api/auth/profile'),
  updateProfile: (data) => apiFetch('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  syncUser: (data) => apiFetch('/api/auth/sync', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Locations API
export const locationsApi = {
  getAll: () => apiFetch('/api/locations'),
  getById: (id) => apiFetch(`/api/locations/${id}`),
  getUnavailableDates: (id) => apiFetch(`/api/locations/${id}/unavailable-dates`),
}

// Menu API
export const menuApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/api/menu${query ? `?${query}` : ''}`)
  },
  getById: (id) => apiFetch(`/api/menu/${id}`),
  getCategories: () => apiFetch('/api/menu/categories/all'),
  getAddons: () => apiFetch('/api/menu/addons/all'),
}

// Packages API
export const packagesApi = {
  getAll: () => apiFetch('/api/packages'),
  getById: (id) => apiFetch(`/api/packages/${id}`),
}

// Bookings API
export const bookingsApi = {
  getMyBookings: () => apiFetch('/api/bookings/my'),
  getById: (id) => apiFetch(`/api/bookings/${id}`),
  create: (data) => apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  cancel: (id) => apiFetch(`/api/bookings/${id}/cancel`, {
    method: 'POST',
  }),
}

// Payments API
export const paymentsApi = {
  createIntent: (data) => apiFetch('/api/payments/create-intent', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  confirm: (data) => apiFetch('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}

// Promo API
export const promoApi = {
  validate: (code) => apiFetch('/api/promo/validate', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
}

// Notifications API
export const notificationsApi = {
  getAll: () => apiFetch('/api/notifications'),
  markRead: (id) => apiFetch(`/api/notifications/${id}/read`, {
    method: 'PUT',
  }),
  markAllRead: () => apiFetch('/api/notifications/read-all', {
    method: 'PUT',
  }),
}

// Admin API
export const adminApi = {
  getDashboard: () => apiFetch('/api/admin/dashboard'),
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/api/admin/bookings${query ? `?${query}` : ''}`)
  },
  updateBooking: (id, data) => apiFetch(`/api/admin/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getMenuItems: () => apiFetch('/api/admin/menu-items'),
  createMenuItem: (formData) => {
    // FormData for file upload
    return fetch(`${API_URL}/api/admin/menu-items`, {
      method: 'POST',
      body: formData,
    }).then(r => r.json())
  },
  getPackages: () => apiFetch('/api/admin/packages'),
  getLocations: () => apiFetch('/api/admin/locations'),
  getPromoCodes: () => apiFetch('/api/admin/promo-codes'),
  createPromoCode: (data) => apiFetch('/api/admin/promo-codes', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
}
