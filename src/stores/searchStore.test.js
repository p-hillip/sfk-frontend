import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSearchStore } from './searchStore.js'
import * as api from '../api/index.js'

// Mock the API
vi.mock('../api/index.js', () => ({
  search: vi.fn(),
  suggest: vi.fn()
}))

describe('SearchStore', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useSearchStore()

    expect(store.q).toBe('')
    expect(store.page).toBe(1)
    expect(store.size).toBe(10)
    expect(store.sortField).toBe('uploadedAt')
    expect(store.sortDir).toBe('desc')
    expect(store.results).toEqual([])
    expect(store.total).toBe(0)
  })

  it('toggleCategory updates category and triggers search', async () => {
    const store = useSearchStore()

    api.search.mockResolvedValue({
      results: [],
      total: 0,
      page: 1,
      size: 10
    })

    expect(store.categories.DOCUMENT).toBe(false)

    await store.toggleCategory('DOCUMENT')

    expect(store.categories.DOCUMENT).toBe(true)
    expect(api.search).toHaveBeenCalled()
  })

  it('setSort toggles direction for same field', async () => {
    const store = useSearchStore()

    api.search.mockResolvedValue({
      results: [],
      total: 0,
      page: 1,
      size: 10
    })

    expect(store.sortField).toBe('uploadedAt')
    expect(store.sortDir).toBe('desc')

    await store.setSort('uploadedAt')

    expect(store.sortField).toBe('uploadedAt')
    expect(store.sortDir).toBe('asc')
  })

  it('setSort sets new field with desc direction', async () => {
    const store = useSearchStore()

    api.search.mockResolvedValue({
      results: [],
      total: 0,
      page: 1,
      size: 10
    })

    await store.setSort('title')

    expect(store.sortField).toBe('title')
    expect(store.sortDir).toBe('desc')
  })

  it('runSearch calls API with correct parameters', async () => {
    const store = useSearchStore()
    store.q = 'test'
    store.categories.DOCUMENT = true
    store.sortField = 'title'
    store.sortDir = 'asc'
    store.page = 2

    const mockResults = [
      { id: 1, title: 'Test File' }
    ]

    api.search.mockResolvedValue({
      results: mockResults,
      total: 1,
      page: 2,
      size: 10
    })

    await store.runSearch()

    expect(api.search).toHaveBeenCalledWith({
      q: 'test',
      categories: ['DOCUMENT'],
      sortField: 'title',
      sortDir: 'asc',
      page: 2,
      size: 10
    })

    expect(store.results).toEqual(mockResults)
    expect(store.total).toBe(1)
  })

  it('runSuggest calls API when query is long enough', async () => {
    const store = useSearchStore()
    store.q = 'te'

    api.suggest.mockResolvedValue(['test1', 'test2'])

    await store.runSuggest()

    expect(api.suggest).toHaveBeenCalledWith('te', [])
    expect(store.suggestions).toEqual(['test1', 'test2'])
  })

  it('runSuggest does not call API for short queries', async () => {
    const store = useSearchStore()
    store.q = 't'

    await store.runSuggest()

    expect(api.suggest).not.toHaveBeenCalled()
    expect(store.suggestions).toEqual([])
  })

  it('setPage changes page and triggers search', async () => {
    const store = useSearchStore()

    api.search.mockResolvedValue({
      results: [],
      total: 50,
      page: 3,
      size: 10
    })

    await store.setPage(3)

    expect(store.page).toBe(3)
    expect(api.search).toHaveBeenCalled()
  })

  it('selectedCategories getter returns only selected categories', () => {
    const store = useSearchStore()

    store.categories.DOCUMENT = true
    store.categories.IMAGE = true
    store.categories.VIDEO = false

    const selected = store.selectedCategories

    expect(selected).toEqual(['DOCUMENT', 'IMAGE'])
  })

  it('totalPages getter calculates correctly', () => {
    const store = useSearchStore()

    store.total = 25
    store.size = 10

    expect(store.totalPages).toBe(3)
  })

  it('hasResults getter returns true when results exist', () => {
    const store = useSearchStore()

    expect(store.hasResults).toBe(false)

    store.results = [{ id: 1 }]

    expect(store.hasResults).toBe(true)
  })
})
