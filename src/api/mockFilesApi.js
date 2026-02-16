import { FILE_CATEGORIES, normalizeFileRecord } from '../models/fileModels.js'

// Generate deterministic fake data
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const SAMPLE_TITLES = [
  'Project Proposal', 'Meeting Notes', 'Budget Report', 'User Manual', 'Technical Specification',
  'Marketing Plan', 'Sales Forecast', 'Quarterly Review', 'Product Roadmap', 'Design Guidelines',
  'Team Photo', 'Logo Design', 'Banner Ad', 'Screenshot', 'Diagram',
  'Tutorial Video', 'Demo Recording', 'Presentation', 'Webinar', 'Training Material',
  'Podcast Episode', 'Interview Recording', 'Music Track', 'Voice Memo', 'Audio Note',
  'Database Backup', 'Project Files', 'Assets Package', 'Source Code', 'Documents Archive',
  'API Documentation', 'Configuration File', 'Script', 'Library', 'Component Code'
]

const SAMPLE_FILENAMES = [
  'proposal_v2.pdf', 'notes_2024.docx', 'budget_q1.xlsx', 'manual.pdf', 'spec_final.md',
  'marketing_plan.pptx', 'forecast.xlsx', 'review_q4.pdf', 'roadmap.pdf', 'guidelines.pdf',
  'team_photo.jpg', 'logo.png', 'banner_1200x600.jpg', 'screenshot.png', 'diagram.svg',
  'tutorial.mp4', 'demo_recording.mov', 'presentation.pptx', 'webinar_2024.mp4', 'training.mp4',
  'podcast_ep01.mp3', 'interview.m4a', 'track_final.mp3', 'voice_memo.m4a', 'audio_note.wav',
  'backup_2024.zip', 'project_files.tar.gz', 'assets.zip', 'source.zip', 'docs.rar',
  'api_docs.md', 'config.json', 'deploy.sh', 'library.js', 'component.vue'
]

const SAMPLE_USERS = [
  'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Anderson',
  'Frank Miller', 'Grace Lee', 'Henry Davis', 'Iris Wang', 'Jack Wilson'
]

const CATEGORY_MAPPING = [
  FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT,
  FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT, FILE_CATEGORIES.DOCUMENT,
  FILE_CATEGORIES.IMAGE, FILE_CATEGORIES.IMAGE, FILE_CATEGORIES.IMAGE, FILE_CATEGORIES.IMAGE, FILE_CATEGORIES.IMAGE,
  FILE_CATEGORIES.VIDEO, FILE_CATEGORIES.VIDEO, FILE_CATEGORIES.VIDEO, FILE_CATEGORIES.VIDEO, FILE_CATEGORIES.VIDEO,
  FILE_CATEGORIES.AUDIO, FILE_CATEGORIES.AUDIO, FILE_CATEGORIES.AUDIO, FILE_CATEGORIES.AUDIO, FILE_CATEGORIES.AUDIO,
  FILE_CATEGORIES.ARCHIVE, FILE_CATEGORIES.ARCHIVE, FILE_CATEGORIES.ARCHIVE, FILE_CATEGORIES.ARCHIVE, FILE_CATEGORIES.ARCHIVE,
  FILE_CATEGORIES.CODE, FILE_CATEGORIES.CODE, FILE_CATEGORIES.CODE, FILE_CATEGORIES.CODE, FILE_CATEGORIES.CODE
]

// Generate 200 deterministic fake records
function generateFakeRecords() {
  const records = []
  for (let i = 0; i < 200; i++) {
    const titleIndex = Math.floor(seededRandom(i * 3) * SAMPLE_TITLES.length)
    const filenameIndex = Math.floor(seededRandom(i * 3 + 1) * SAMPLE_FILENAMES.length)
    const userIndex = Math.floor(seededRandom(i * 3 + 2) * SAMPLE_USERS.length)
    const categoryIndex = Math.floor(seededRandom(i * 5) * CATEGORY_MAPPING.length)

    const daysAgo = Math.floor(seededRandom(i * 7) * 365)
    const uploadDate = new Date()
    uploadDate.setDate(uploadDate.getDate() - daysAgo)

    const fileSize = Math.floor(seededRandom(i * 11) * 50000000) + 1000 // 1KB to 50MB

    records.push({
      id: `file_${i + 1}`,
      title: `${SAMPLE_TITLES[titleIndex]} ${i + 1}`,
      filename: SAMPLE_FILENAMES[filenameIndex].replace(/\.(.*?)$/, `_${i + 1}.$1`),
      category: CATEGORY_MAPPING[categoryIndex],
      uploadedAt: uploadDate.toISOString(),
      uploadedBy: SAMPLE_USERS[userIndex],
      fileSize: fileSize,
      metadataText: `Metadata for ${SAMPLE_TITLES[titleIndex]} - tags: important, project, ${CATEGORY_MAPPING[categoryIndex].toLowerCase()}`,
      downloadUrl: `/api/files/download/file_${i + 1}`
    })
  }
  return records
}

const FAKE_RECORDS = generateFakeRecords()

// Mock auth state
let mockAuthToken = null
let mockUser = null

// Search implementation
export async function search(req) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100))

  let filtered = [...FAKE_RECORDS]

  // Filter by categories
  if (req.categories && req.categories.length > 0) {
    filtered = filtered.filter(record => req.categories.includes(record.category))
  }

  // Search in title, filename, and metadataText
  if (req.q && req.q.trim()) {
    const query = req.q.toLowerCase()
    filtered = filtered.filter(record =>
      record.title.toLowerCase().includes(query) ||
      record.filename.toLowerCase().includes(query) ||
      record.metadataText.toLowerCase().includes(query)
    )
  }

  // Sort
  const sortField = req.sortField || 'uploadedAt'
  const sortDir = req.sortDir || 'desc'

  filtered.sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]

    // Handle date strings
    if (sortField === 'uploadedAt') {
      aVal = new Date(aVal).getTime()
      bVal = new Date(bVal).getTime()
    }

    // Handle strings
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }

    if (sortDir === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
    }
  })

  // Paginate
  const page = req.page || 1
  const size = req.size || 10
  const start = (page - 1) * size
  const end = start + size

  const results = filtered.slice(start, end).map(normalizeFileRecord)

  return {
    results,
    total: filtered.length,
    page,
    size
  }
}

// Suggest implementation
export async function suggest(q, categories) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 50))

  if (!q || !q.trim()) {
    return []
  }

  let filtered = [...FAKE_RECORDS]

  // Filter by categories
  if (categories && categories.length > 0) {
    filtered = filtered.filter(record => categories.includes(record.category))
  }

  // Find matching titles
  const query = q.toLowerCase()
  const suggestions = new Set()

  for (const record of filtered) {
    if (record.title.toLowerCase().includes(query)) {
      suggestions.add(record.title)
    }
    if (record.filename.toLowerCase().includes(query)) {
      suggestions.add(record.filename)
    }
    if (suggestions.size >= 5) break
  }

  return Array.from(suggestions).slice(0, 5)
}

// Auth implementation - accepts any email/password
export async function login(email, password, remember) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  if (!email || !password) {
    throw new Error('Email and password are required')
  }

  mockAuthToken = 'mock_token_' + Date.now()
  mockUser = {
    id: 'user_1',
    email: email,
    name: email.split('@')[0]
  }

  return {
    token: mockAuthToken,
    user: mockUser
  }
}

export async function logout() {
  await new Promise(resolve => setTimeout(resolve, 100))
  mockAuthToken = null
  mockUser = null
}

export async function me() {
  await new Promise(resolve => setTimeout(resolve, 50))

  if (!mockAuthToken || !mockUser) {
    throw new Error('Not authenticated')
  }

  return {
    user: mockUser
  }
}
