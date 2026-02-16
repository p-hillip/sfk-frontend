<template>
  <div class="min-h-screen bg-gray-100">
    <TopBar @login="$router.push('/')" @upload="() => {}" />

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Upload Files</h1>
        <p class="text-gray-600 mb-8">
          This is a placeholder page for file upload functionality.
          It will be implemented in a future iteration.
        </p>

        <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
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
          <p class="mt-2 text-sm text-gray-600">Drag and drop files here (Coming soon)</p>
        </div>

        <div class="mt-8">
          <button
            @click="$router.push('/')"
            class="cursor-pointer w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar.vue'

export default {
  name: 'UploadPage',
  components: {
    TopBar
  }
}
</script>
