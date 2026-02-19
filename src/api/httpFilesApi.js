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

// Upload file
export async function uploadFile(file, title, category, metadataText, onProgress) {
  const token = getAuthToken()
  const formData = new FormData()
  formData.append('file', file)
  if (title) formData.append('title', title)
  if (category) formData.append('category', category)
  if (metadataText) formData.append('metadataText', metadataText)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded * 100) / e.total)
        onProgress(percentComplete)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch (error) {
          resolve({})
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject(new Error(error.message || `HTTP ${xhr.status}`))
        } catch {
          reject(new Error(`HTTP ${xhr.status}`))
        }
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error'))
    })

    xhr.open('POST', `${API_BASE_URL}/api/files/upload`)
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.send(formData)
  })
}

// Delete file
export async function deleteFile(fileId) {
  const url = `${API_BASE_URL}/api/files/${fileId}`

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    }
  })

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('You do not have permission to delete this file')
    } else if (response.status === 404) {
      throw new Error('File not found')
    } else {
      throw new Error(`HTTP ${response.status}`)
    }
  }

  // 204 No Content returns nothing
}
