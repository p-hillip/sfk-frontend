// API interface contract
// All implementations must provide these methods

/**
 * @typedef {Object} SearchRequest
 * @property {string} q - Search query
 * @property {string[]} categories - Array of category filters
 * @property {string} sortField - Field to sort by (uploadedAt, title, fileSize, etc.)
 * @property {string} sortDir - Sort direction (asc or desc)
 * @property {number} page - Page number (1-indexed)
 * @property {number} size - Page size
 */

/**
 * @typedef {Object} SearchResponse
 * @property {Array} results - Array of file records
 * @property {number} total - Total number of matching records
 * @property {number} page - Current page
 * @property {number} size - Page size
 */

/**
 * Search for files
 * @param {SearchRequest} req - Search request
 * @returns {Promise<SearchResponse>}
 */
export function search(req) {
  throw new Error('Not implemented')
}

/**
 * Get search suggestions
 * @param {string} q - Query string
 * @param {string[]} categories - Category filters
 * @returns {Promise<string[]>} Array of suggestions (max 5)
 */
export function suggest(q, categories) {
  throw new Error('Not implemented')
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} remember - Remember me flag
 * @returns {Promise<{token: string, user: Object}>}
 */
export function login(email, password, remember) {
  throw new Error('Not implemented')
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export function logout() {
  throw new Error('Not implemented')
}

/**
 * Get current user session
 * @returns {Promise<{user: Object}>}
 */
export function me() {
  throw new Error('Not implemented')
}
