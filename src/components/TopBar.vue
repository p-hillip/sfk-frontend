<template>
  <div class="bg-blue-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center">
        <h1 class="text-2xl font-bold">SpringFileKeeper</h1>
      </div>

      <div class="flex items-center space-x-4">
        <button
          v-if="authStore.isAuthenticated"
          @click="$emit('upload')"
          class="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 font-semibold"
        >
          Upload File
        </button>

        <button
          v-if="!authStore.isAuthenticated"
          @click="$emit('login')"
          class="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 font-medium"
        >
          Login
        </button>

        <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
          <button
            @click="handleLogout"
            class="cursor-pointer bg-red-900 text-red-50 px-4 py-2 rounded hover:bg-red-600 font-semibold"
          >
            <span class="flex items-center">
              {{ authStore.user.name.toUpperCase() }}
              <ArrowRightStartOnRectangleIcon class="h-5 w-5 ml-1.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ArrowRightStartOnRectangleIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '../stores/authStore.js'

export default {
  name: 'TopBar',
  components: {
    ArrowRightStartOnRectangleIcon
  },
  emits: ['login', 'upload'],
  setup() {
    const authStore = useAuthStore()

    const handleLogout = async () => {
      await authStore.logout()
    }

    return {
      authStore,
      handleLogout
    }
  }
}
</script>
