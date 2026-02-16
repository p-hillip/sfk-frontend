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
              <a
                :href="file.downloadUrl"
                class="text-blue-600 hover:text-blue-800 font-medium"
                download
              >
                Download
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useSearchStore } from '../stores/searchStore.js'

export default {
  name: 'ResultsTable',
  setup() {
    const searchStore = useSearchStore()

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

    return {
      searchStore,
      formatDate,
      formatSize
    }
  }
}
</script>
