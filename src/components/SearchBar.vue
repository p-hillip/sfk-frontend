<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="localQuery"
        @input="handleInput"
        @keydown.enter="handleEnter"
        @focus="showSuggestions = true"
        @blur="handleBlur"
        type="text"
        placeholder="Search files..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="handleSearch"
        class="cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>
    </div>

    <!-- Suggestions dropdown -->
    <div
      v-if="showSuggestions && searchStore.suggestions.length > 0"
      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="(suggestion, index) in searchStore.suggestions"
        :key="index"
        @mousedown="selectSuggestion(suggestion)"
        class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useSearchStore } from '../stores/searchStore.js'

export default {
  name: 'SearchBar',
  setup() {
    const searchStore = useSearchStore()
    const localQuery = ref(searchStore.q)
    const showSuggestions = ref(false)
    let debounceTimer = null

    const handleInput = () => {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // Set new timer for suggestions
      debounceTimer = setTimeout(() => {
        searchStore.q = localQuery.value
        searchStore.runSuggest()
      }, 300)
    }

    const handleEnter = () => {
      showSuggestions.value = false
      searchStore.q = localQuery.value
      searchStore.page = 1
      searchStore.runSearch()
    }

    const handleSearch = () => {
      showSuggestions.value = false
      searchStore.q = localQuery.value
      searchStore.page = 1
      searchStore.runSearch()
    }

    const selectSuggestion = (suggestion) => {
      localQuery.value = suggestion
      searchStore.q = suggestion
      showSuggestions.value = false
      searchStore.page = 1
      searchStore.runSearch()
    }

    const handleBlur = () => {
      // Delay hiding to allow click on suggestion
      setTimeout(() => {
        showSuggestions.value = false
      }, 200)
    }

    // Watch for external changes to search query
    watch(() => searchStore.q, (newVal) => {
      localQuery.value = newVal
    })

    return {
      searchStore,
      localQuery,
      showSuggestions,
      handleInput,
      handleEnter,
      handleSearch,
      selectSuggestion,
      handleBlur
    }
  }
}
</script>
