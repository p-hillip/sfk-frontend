<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Loading state -->
    <div v-if="searchStore.loading" class="p-8 text-center text-gray-500">
      Loading...
    </div>

    <!-- Error state -->
    <div v-else-if="searchStore.error" class="p-8 text-center text-red-500">
      {{ searchStore.error }}
    </div>

    <!-- No results -->
    <div v-else-if="!searchStore.hasResults" class="p-8 text-center text-gray-500">
      No files found
    </div>

    <!-- Results table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th
              @click="searchStore.setSort('title')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Title</span>
                <span v-if="searchStore.sortField === 'title'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              @click="searchStore.setSort('filename')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Filename</span>
                <span v-if="searchStore.sortField === 'filename'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              @click="searchStore.setSort('category')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Category</span>
                <span v-if="searchStore.sortField === 'category'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              @click="searchStore.setSort('uploadedAt')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Uploaded</span>
                <span v-if="searchStore.sortField === 'uploadedAt'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              @click="searchStore.setSort('uploadedBy')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Uploaded By</span>
                <span v-if="searchStore.sortField === 'uploadedBy'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th
              @click="searchStore.setSort('fileSize')"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
            >
              <div class="flex items-center space-x-1">
                <span>Size</span>
                <span v-if="searchStore.sortField === 'fileSize'">
                  {{ searchStore.sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="file in searchStore.results"
            :key="file.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm text-gray-900">{{ file.title }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ file.filename }}</td>
            <td class="px-4 py-3 text-sm">
              <span class="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                {{ file.category }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ formatDate(file.uploadedAt) }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ file.uploadedBy }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ formatSize(file.fileSize) }}</td>
            <td class="px-4 py-3 text-sm">
              <div class="flex items-center space-x-3">
                <a
                  :href="file.downloadUrl"
                  class="text-blue-600 hover:text-blue-800"
                  download
                  title="Download file"
                >
                  <ArrowDownTrayIcon class="h-5 w-5" />
                </a>
                <button
                  v-if="canDeleteFile(file)"
                  @click="handleDelete(file)"
                  class="cursor-pointer text-red-600 hover:text-red-800"
                  title="Delete file"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { useSearchStore } from '../stores/searchStore.js'
import { useAuthStore } from '../stores/authStore.js'
import * as api from '../api/index.js'

export default {
  name: 'ResultsTable',
  components: {
    TrashIcon,
    ArrowDownTrayIcon
  },
  setup() {
    const searchStore = useSearchStore()
    const authStore = useAuthStore()

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    const canDeleteFile = (file) => {
      // User must be logged in and own the file
      // Use uploadedByUserId for ownership check (not uploadedBy which is the display name)
      return authStore.isAuthenticated && authStore.user?.id === file.uploadedByUserId
    }

    const handleDelete = async (file) => {
      // Confirm deletion
      if (!confirm(`Are you sure you want to delete "${file.filename}"?`)) {
        return
      }

      try {
        await api.deleteFile(file.id)
        // Refresh the search results
        await searchStore.runSearch()
      } catch (error) {
        console.error('Delete failed:', error)
        alert(`Failed to delete file: ${error.message}`)
      }
    }

    return {
      searchStore,
      formatDate,
      formatSize,
      canDeleteFile,
      handleDelete
    }
  }
}
</script>
