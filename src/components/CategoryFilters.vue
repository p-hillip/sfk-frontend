<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-3">Categories</h3>
    <div class="space-y-2">
      <label
        v-for="category in categories"
        :key="category.value"
        class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
      >
        <input
          type="checkbox"
          :checked="searchStore.categories[category.value]"
          @change="searchStore.toggleCategory(category.value)"
          class="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span class="text-sm">{{ category.label }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { useSearchStore } from '../stores/searchStore.js'
import { FILE_CATEGORIES, CATEGORY_LABELS } from '../models/fileModels.js'

export default {
  name: 'CategoryFilters',
  setup() {
    const searchStore = useSearchStore()

    const categories = Object.keys(FILE_CATEGORIES).map(key => ({
      value: FILE_CATEGORIES[key],
      label: CATEGORY_LABELS[FILE_CATEGORIES[key]]
    }))

    return {
      searchStore,
      categories
    }
  }
}
</script>
