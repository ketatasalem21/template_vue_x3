<template>
  <div class="space-y-4">
    <div
      :class="`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragOver
          ? 'border-blue-500 bg-blue-500/10'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <div v-if="selectedImage" class="space-y-2">
        <img
          :src="selectedImage"
          alt="Preview"
          class="mx-auto max-h-32 rounded"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400">Image sélectionnée</p>
      </div>
      <div v-else class="space-y-2">
        <ImageIcon class="mx-auto w-12 h-12 text-gray-400" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Déposer un fichier depuis l'explorateur ou le sélectionner
        </p>
      </div>
    </div>
    
    <div class="flex items-center space-x-2">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      <button
        @click="$refs.fileInput?.click()"
        class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition-colors"
      >
        <Upload class="w-4 h-4" />
        <span>Sélectionner le fichier</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Upload, Image as ImageIcon } from 'lucide-vue-next'

const isDragOver = ref(false)
const selectedImage = ref(null)
const fileInput = ref()

const handleDrop = (e) => {
  isDragOver.value = false
  
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImage.value = e.target?.result
      }
      reader.readAsDataURL(file)
    }
  }
}

const handleFileSelect = (e) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImage.value = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}
</script>