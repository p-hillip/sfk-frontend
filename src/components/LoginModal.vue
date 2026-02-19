<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 mb-4"
              >
                Login to SpringFileKeeper
              </DialogTitle>

              <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                  <!-- Email field -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <!-- Password field -->
                  <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      v-model="password"
                      type="password"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                  </div>

                  <!-- Remember me checkbox -->
                  <div class="flex items-center">
                    <input
                      id="remember"
                      v-model="remember"
                      type="checkbox"
                      class="cursor-pointer w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="remember" class="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <!-- Error message -->
                  <div v-if="error" class="text-sm text-red-600">
                    {{ error }}
                  </div>
                </div>

                <div class="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    :disabled="loading"
                    class="cursor-pointer flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {{ loading ? 'Logging in...' : 'Login' }}
                  </button>
                  <button
                    type="button"
                    @click="closeModal"
                    class="cursor-pointer flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle
} from '@headlessui/vue'
import { useAuthStore } from '../stores/authStore.js'

export default {
  name: 'LoginModal',
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  setup(props, { emit }) {
    const authStore = useAuthStore()

    // Load remembered email and remember-me preference
    const rememberedEmail = localStorage.getItem('remember_email') || ''
    const rememberMe = localStorage.getItem('remember_me') === 'true'

    const email = ref(rememberedEmail)
    const password = ref('')
    const remember = ref(rememberMe)
    const loading = ref(false)
    const error = ref(null)

    const closeModal = () => {
      emit('close')
      // Reset password only (keep email and remember if they were saved)
      password.value = ''
      error.value = null
    }

    const handleSubmit = async () => {
      loading.value = true
      error.value = null

      try {
        await authStore.login(email.value, password.value, remember.value)
        closeModal()
      } catch (err) {
        error.value = err.message || 'Login failed. Please try again.'
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      password,
      remember,
      loading,
      error,
      closeModal,
      handleSubmit
    }
  }
}
</script>
