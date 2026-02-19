// File category constants
export const FILE_CATEGORIES = {
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO',
  ARCHIVE: 'ARCHIVE',
  CODE: 'CODE',
  OTHER: 'OTHER'
}

export const CATEGORY_LABELS = {
  [FILE_CATEGORIES.DOCUMENT]: 'Document',
  [FILE_CATEGORIES.IMAGE]: 'Image',
  [FILE_CATEGORIES.VIDEO]: 'Video',
  [FILE_CATEGORIES.AUDIO]: 'Audio',
  [FILE_CATEGORIES.ARCHIVE]: 'Archive',
  [FILE_CATEGORIES.CODE]: 'Code',
  [FILE_CATEGORIES.OTHER]: 'Other'
}

// Normalize a raw file record from API
export function normalizeFileRecord(raw) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  let downloadUrl = raw.downloadUrl || raw.download_url || ''

  // If downloadUrl is relative, prepend the API base URL
  if (downloadUrl && !downloadUrl.startsWith('http')) {
    downloadUrl = API_BASE_URL + downloadUrl
  }

  return {
    id: raw.id,
    title: raw.title || '',
    filename: raw.filename || raw.fileName || '',
    category: raw.category || FILE_CATEGORIES.OTHER,
    uploadedAt: raw.uploadedAt || raw.uploaded_at || new Date().toISOString(),
    uploadedBy: raw.uploadedBy || raw.uploaded_by || 'Unknown',
    uploadedByUserId: raw.uploadedByUserId || raw.uploaded_by_user_id || null,
    fileSize: raw.fileSize || raw.file_size || 0,
    metadataText: raw.metadataText || raw.metadata_text || '',
    downloadUrl: downloadUrl
  }
}
