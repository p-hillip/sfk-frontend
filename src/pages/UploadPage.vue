<template>
  <div class="min-h-screen bg-gray-100">
    <TopBar @login="$router.push('/')" @upload="() => {}" />

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Upload Files</h1>

        <!-- Error/Success Messages -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {{ successMessage }}
        </div>

        <!-- No Upload Permission Warning -->
        <div v-if="!canUpload" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700">
          You do not have permission to upload files. Please contact an administrator.
        </div>

        <!-- Upload Form -->
        <div v-if="canUpload">
          <!-- File Drop Zone -->
          <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
              'border-2 border-dashed rounded-lg p-12 text-center transition-colors mb-6',
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
            ]"
          >
            <svg
              class="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-600">
              {{ selectedFile ? selectedFile.name : 'Drag and drop a file here, or click to select' }}
            </p>
            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="hidden"
            />
            <button
              @click="$refs.fileInput.click()"
              type="button"
              class="cursor-pointer mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Select File
            </button>
          </div>

          <!-- File Details Form -->
          <div v-if="selectedFile" class="space-y-4">
            <!-- Title -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Title (Optional)
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a title for this file"
              />
            </div>

            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
                Category (Optional - Auto-detected if not provided)
              </label>
              <select
                id="category"
                v-model="category"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Auto-detect</option>
                <option value="DOCUMENT">Document</option>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
                <option value="AUDIO">Audio</option>
                <option value="ARCHIVE">Archive</option>
                <option value="CODE">Code</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <!-- Metadata -->
            <div>
              <label for="metadata" class="block text-sm font-medium text-gray-700 mb-1">
                Description/Metadata (Optional)
              </label>
              <textarea
                id="metadata"
                v-model="metadataText"
                rows="3"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a description or metadata for this file"
              ></textarea>
            </div>

            <!-- File Info -->
            <div class="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p><strong>File:</strong> {{ selectedFile.name }}</p>
              <p><strong>Size:</strong> {{ formatFileSize(selectedFile.size) }}</p>
              <p><strong>Type:</strong> {{ selectedFile.type || 'Unknown' }}</p>
            </div>

            <!-- Upload Progress -->
            <div v-if="uploading" class="space-y-2">
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 text-center">Uploading... {{ uploadProgress }}%</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-4">
              <button
                @click="uploadFile"
                :disabled="uploading"
                class="cursor-pointer flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {{ uploading ? 'Uploading...' : 'Upload File' }}
              </button>
              <button
                @click="clearFile"
                :disabled="uploading"
                class="cursor-pointer px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button
            @click="$router.push('/')"
            class="cursor-pointer w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore.js'
import * as api from '../api/index.js'
import TopBar from '../components/TopBar.vue'

export default {
  name: 'UploadPage',
  components: {
    TopBar
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const selectedFile = ref(null)
    const title = ref('')
    const category = ref('')
    const metadataText = ref('')
    const isDragging = ref(false)
    const uploading = ref(false)
    const uploadProgress = ref(0)
    const errorMessage = ref('')
    const successMessage = ref('')
    const fileInput = ref(null)

    const canUpload = computed(() => authStore.user?.canUpload || false)

    onMounted(async () => {
      if (!authStore.isAuthenticated) {
        router.push('/')
        return
      }

      // Refresh user data to ensure we have latest permissions
      try {
        await authStore.init()
      } catch (error) {
        console.error('Failed to check upload permission:', error)
        router.push('/')
      }
    })

    const handleDrop = (e) => {
      isDragging.value = false
      const files = e.dataTransfer.files
      if (files.length > 0) {
        selectedFile.value = files[0]
        errorMessage.value = ''
        successMessage.value = ''
      }
    }

    const handleFileSelect = (e) => {
      const files = e.target.files
      if (files.length > 0) {
        selectedFile.value = files[0]
        errorMessage.value = ''
        successMessage.value = ''
      }
    }

    const clearFile = () => {
      selectedFile.value = null
      title.value = ''
      category.value = ''
      metadataText.value = ''
      uploadProgress.value = 0
      errorMessage.value = ''
      successMessage.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    const uploadFile = async () => {
      if (!selectedFile.value) return

      uploading.value = true
      uploadProgress.value = 0
      errorMessage.value = ''
      successMessage.value = ''

      try {
        await api.uploadFile(
          selectedFile.value,
          title.value,
          category.value,
          metadataText.value,
          (progress) => {
            uploadProgress.value = progress
          }
        )

        successMessage.value = 'File uploaded successfully!'
        setTimeout(() => {
          clearFile()
          successMessage.value = ''
        }, 3000)
      } catch (error) {
        console.error('Upload failed:', error)
        console.error('Error message:', error.message)
        console.error('Error details:', error)

        if (error.message.includes('403') || error.message.includes('Forbidden')) {
          // Check if user actually has permission - if yes, it's a backend issue
          if (canUpload.value) {
            errorMessage.value = 'Server rejected upload request (403). Check backend logs for details.'
          } else {
            errorMessage.value = 'You do not have permission to upload files. Please contact an administrator.'
          }
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage.value = 'Your session has expired. Please log in again.'
          setTimeout(() => router.push('/'), 2000)
        } else {
          // Show the actual error message from the server
          errorMessage.value = error.message || 'Failed to upload file. Please try again.'
        }
      } finally {
        uploading.value = false
      }
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return {
      authStore,
      canUpload,
      selectedFile,
      title,
      category,
      metadataText,
      isDragging,
      uploading,
      uploadProgress,
      errorMessage,
      successMessage,
      fileInput,
      handleDrop,
      handleFileSelect,
      clearFile,
      uploadFile,
      formatFileSize
    }
  }
}
</script>
