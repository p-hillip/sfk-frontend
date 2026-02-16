<template>
  <div class="min-h-screen bg-gray-100">
    <TopBar @login="showLoginModal = true" @upload="goToUpload" />

    <div class="container mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Search bar -->
        <SearchBar />

        <!-- Main content grid -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Category filters sidebar -->
          <div class="lg:col-span-1">
            <CategoryFilters />
          </div>

          <!-- Results and pagination -->
          <div class="lg:col-span-3 space-y-6">
            <ResultsTable />
            <Pagination v-if="searchStore.hasResults" />
          </div>
        </div>
      </div>
    </div>

    <!-- Login modal -->
    <LoginModal :is-open="showLoginModal" @close="showLoginModal = false" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import { useSearchStore } from '../stores/searchStore.js'
import TopBar from '../components/TopBar.vue'
import SearchBar from '../components/SearchBar.vue'
import CategoryFilters from '../components/CategoryFilters.vue'
import ResultsTable from '../components/ResultsTable.vue'
import Pagination from '../components/Pagination.vue'
import LoginModal from '../components/LoginModal.vue'

export default {
  name: 'HomePage',
  components: {
    TopBar,
    SearchBar,
    CategoryFilters,
    ResultsTable,
    Pagination,
    LoginModal
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const searchStore = useSearchStore()
    const showLoginModal = ref(false)

    onMounted(async () => {
      // Load default search results
      await searchStore.loadDefault()
    })

    const goToUpload = () => {
      router.push('/upload')
    }

    return {
      authStore,
      searchStore,
      showLoginModal,
      goToUpload
    }
  }
}
</script>
