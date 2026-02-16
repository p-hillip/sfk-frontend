<template>
  <div class="bg-white px-4 py-3 rounded-lg shadow flex items-center justify-between">
    <!-- Total results -->
    <div class="text-sm text-gray-700">
      Showing
      <span class="font-medium">{{ startIndex }}</span>
      to
      <span class="font-medium">{{ endIndex }}</span>
      of
      <span class="font-medium">{{ searchStore.total }}</span>
      results
    </div>

    <!-- Pagination controls -->
    <div class="flex items-center space-x-2">
      <button
        @click="searchStore.prevPage()"
        :disabled="searchStore.page === 1"
        :class="[
          'px-3 py-1 rounded border',
          searchStore.page === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        ]"
      >
        Prev
      </button>

      <!-- Page numbers -->
      <div class="flex items-center space-x-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="searchStore.setPage(page)"
          :class="[
            'px-3 py-1 rounded',
            page === searchStore.page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border'
          ]"
        >
          {{ page }}
        </button>
      </div>

      <button
        @click="searchStore.nextPage()"
        :disabled="searchStore.page === searchStore.totalPages"
        :class="[
          'px-3 py-1 rounded border',
          searchStore.page === searchStore.totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        ]"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useSearchStore } from '../stores/searchStore.js'

export default {
  name: 'Pagination',
  setup() {
    const searchStore = useSearchStore()

    const startIndex = computed(() => {
      if (searchStore.total === 0) return 0
      return (searchStore.page - 1) * searchStore.size + 1
    })

    const endIndex = computed(() => {
      const end = searchStore.page * searchStore.size
      return Math.min(end, searchStore.total)
    })

    const visiblePages = computed(() => {
      const total = searchStore.totalPages
      const current = searchStore.page
      const pages = []

      if (total <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= total; i++) {
          pages.push(i)
        }
      } else {
        // Show first, last, and pages around current
        if (current <= 3) {
          for (let i = 1; i <= 5; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        } else if (current >= total - 2) {
          pages.push(1)
          pages.push('...')
          for (let i = total - 4; i <= total; i++) pages.push(i)
        } else {
          pages.push(1)
          pages.push('...')
          for (let i = current - 1; i <= current + 1; i++) pages.push(i)
          pages.push('...')
          pages.push(total)
        }
      }

      return pages.filter(p => p !== '...')
    })

    return {
      searchStore,
      startIndex,
      endIndex,
      visiblePages
    }
  }
}
</script>
