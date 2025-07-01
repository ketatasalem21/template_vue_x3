<template>
  <div class="h-full bg-white border-r border-gray-200 flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Articles</h2>
    </div>

    <!-- Articles List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="articles.length === 0" class="p-4 text-center text-gray-500">
        No articles available
      </div>
      
      <div v-else class="space-y-1 p-2">
        <button
          v-for="article in articles"
          :key="article.id"
          @click="$emit('select-article', article)"
          :class="[
            'w-full text-left p-3 rounded-lg transition-colors duration-200',
            selectedArticle?.id === article.id
              ? 'bg-blue-50 border border-blue-200 text-blue-900'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <div class="font-medium truncate">{{ article.title }}</div>
          <div class="text-sm text-gray-500 truncate mt-1">
            {{ article.description || 'No description' }}
          </div>
          <div class="text-xs text-gray-400 mt-1">
            {{ formatDate(article.createdAt) }}
          </div>
        </button>
      </div>
    </div>

    <!-- Mobile Toggle Button -->
    <div class="p-4 border-t border-gray-200 md:hidden">
      <button
        @click="$emit('toggle-mobile-view')"
        class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-gray-700"
      >
        Toggle View
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

// Define props
const props = defineProps({
  articles: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedArticle: {
    type: Object,
    default: null
  }
})

// Define emits
const emit = defineEmits(['select-article', 'toggle-mobile-view'])

// Helper function to format dates
const formatDate = (date) => {
  if (!date) return 'Unknown date'
  
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>