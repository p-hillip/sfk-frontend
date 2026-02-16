import { defineStore } from 'pinia'
import * as api from '../api/index.js'
import { FILE_CATEGORIES } from '../models/fileModels.js'

export const useSearchStore = defineStore('search', {
  state: () => ({
    q: '',
    categories: {
      [FILE_CATEGORIES.DOCUMENT]: false,
      [FILE_CATEGORIES.IMAGE]: false,
      [FILE_CATEGORIES.VIDEO]: false,
      [FILE_CATEGORIES.AUDIO]: false,
      [FILE_CATEGORIES.ARCHIVE]: false,
      [FILE_CATEGORIES.CODE]: false,
      [FILE_CATEGORIES.OTHER]: false
    },
    sortField: 'uploadedAt',
    sortDir: 'desc',
    page: 1,
    size: 10,
    results: [],
    total: 0,
    suggestions: [],
    loading: false,
    error: null
  }),

  getters: {
    selectedCategories: (state) => {
      return Object.keys(state.categories).filter(cat => state.categories[cat])
    },

    totalPages: (state) => {
      return Math.ceil(state.total / state.size)
    },

    hasResults: (state) => {
      return state.results.length > 0
    }
  },

  actions: {
    async loadDefault() {
      // Load initial results without any filters
      this.q = ''
      Object.keys(this.categories).forEach(cat => {
        this.categories[cat] = false
      })
      this.sortField = 'uploadedAt'
      this.sortDir = 'desc'
      this.page = 1

      await this.runSearch()
    },

    async runSearch() {
      this.loading = true
      this.error = null

      try {
        const req = {
          q: this.q,
          categories: this.selectedCategories,
          sortField: this.sortField,
          sortDir: this.sortDir,
          page: this.page,
          size: this.size
        }

        const response = await api.search(req)
        this.results = response.results
        this.total = response.total
      } catch (error) {
        this.error = error.message || 'Search failed'
        this.results = []
        this.total = 0
      } finally {
        this.loading = false
      }
    },

    async runSuggest() {
      if (!this.q || this.q.trim().length < 2) {
        this.suggestions = []
        return
      }

      try {
        this.suggestions = await api.suggest(this.q, this.selectedCategories)
      } catch (error) {
        this.suggestions = []
      }
    },

    toggleCategory(category) {
      this.categories[category] = !this.categories[category]
      this.page = 1 // Reset to first page when filters change
      this.runSearch()
    },

    setSort(field) {
      if (this.sortField === field) {
        // Toggle direction if same field
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc'
      } else {
        // Set new field with default desc direction
        this.sortField = field
        this.sortDir = 'desc'
      }
      this.page = 1 // Reset to first page when sort changes
      this.runSearch()
    },

    setPage(page) {
      if (page < 1 || page > this.totalPages) {
        return
      }
      this.page = page
      this.runSearch()
    },

    nextPage() {
      this.setPage(this.page + 1)
    },

    prevPage() {
      this.setPage(this.page - 1)
    }
  }
})
