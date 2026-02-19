// API mode switching based on VITE_API_MODE environment variable

const API_MODE = import.meta.env.VITE_API_MODE || 'mock'

let apiImplementation

if (API_MODE === 'http') {
  // Load HTTP API implementation
  apiImplementation = await import('./httpFilesApi.js')
} else {
  // Default to mock API
  apiImplementation = await import('./mockFilesApi.js')
}

export const { search, suggest, login, logout, me, uploadFile, deleteFile } = apiImplementation
