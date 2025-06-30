<template>
  <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
    <div class="flex overflow-x-auto no-scrollbar space-x-4 px-4 py-2">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="$emit('tabChange', tab.id)"
        :class="`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
          activeTab === tab.id
            ? 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border-b-2 border-blue-500'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
        }`"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tabs: Array,
  activeTab: String
})

defineEmits(['tabChange'])
</script>