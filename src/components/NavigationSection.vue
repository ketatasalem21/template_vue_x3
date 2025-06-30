<template>
  <div class="space-y-3">
    <button
      @click="$emit('toggle')"
      class="flex items-center justify-between w-full text-left"
    >
      <h4 class="font-semibold text-gray-900 dark:text-white flex items-center">
        <ChevronDown 
          v-if="expanded" 
          class="w-4 h-4 mr-2 transition-transform" 
        />
        <ChevronRight 
          v-else 
          class="w-4 h-4 mr-2 transition-transform" 
        />
        {{ title }}
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400 font-normal">
          ({{ items.length }})
        </span>
      </h4>
      <span class="text-xs text-gray-400 dark:text-gray-500">
        {{ expanded ? 'Réduire' : 'Développer' }}
      </span>
    </button>
    
    <div 
      v-show="expanded"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 ml-6 transition-all duration-200"
    >
      <button
        v-for="item in items"
        :key="item.name"
        @click="$emit('itemClick', item)"
        :class="`text-left p-3 rounded-lg border transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transform hover:-translate-y-0.5 ${
          item.highlighted 
            ? 'border-red-300 bg-red-50 dark:bg-red-900/20 shadow-md' 
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`"
      >
        <div class="font-medium text-sage-blue-700 dark:text-sage-blue-400 text-sm">
          {{ item.name }}
        </div>
        <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
          {{ item.description }}
        </div>
        <div v-if="item.action" class="mt-2">
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-sage-blue-100 text-sage-blue-800 dark:bg-sage-blue-900 dark:text-sage-blue-200">
            Action disponible
          </span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ChevronDown, ChevronRight } from 'lucide-vue-next'

defineProps({
  title: String,
  items: Array,
  expanded: {
    type: Boolean,
    default: true
  }
})

defineEmits(['itemClick', 'toggle'])
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>