import { normalizeFileRecord } from '../models/fileModels.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Helper to get auth token
function getAuthToken() {
  return localStorage.getItem('auth_token')
}

// Helper to make authenticated requests
async function fetchWithAuth(url, options = {}) {
  const token = getAuthToken()
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP ${response.status}`)
  }

  return response.json()
}

// Search implementation
export async function search(req) {
  const params = new URLSearchParams()
  if (req.q) params.append('q', req.q)
  if (req.categories && req.categories.length > 0) {
    req.categories.forEach(cat => params.append('categories', cat))
  }
  if (req.sortField) params.append('sortField', req.sortField)
  if (req.sortDir) params.append('sortDir', req.sortDir)
  params.append('page', req.page || 1)
  params.append('size', req.size || 10)

  const data = await fetchWithAuth(`${API_BASE_URL}/api/search?${params}`)

  return {
    results: data.results.map(normalizeFileRecord),
    total: data.total,
    page: data.page,
    size: data.size
  }
}

// Suggest implementation
export async function suggest(q, categories) {
  const params = new URLSearchParams()
  if (q) params.append('q', q)
  if (categories && categories.length > 0) {
    categories.forEach(cat => params.append('categories', cat))
  }

  const data = await fetchWithAuth(`${API_BASE_URL}/api/search/suggest?${params}`)
  return data.suggestions || []
}

// Login implementation
export async function login(email, password, remember) {
  const data = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, remember })
  }).then(async response => {
    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || 'Login failed')
    }
    return response.json()
  })

  return {
    token: data.token,
    user: data.user
  }
}

// Logout implementation
export async function logout() {
  try {
    await fetchWithAuth(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST'
    })
  } catch (error) {
    // Ignore errors during logout
    console.warn('Logout error:', error)
  }
}

// Get current user session
export async function me() {
  const data = await fetchWithAuth(`${API_BASE_URL}/api/auth/me`)
  return {
    user: data.user
  }
}
