<template>
  <button
    @click="$emit('select', category.id)"
    :class="`w-full text-left p-2 rounded text-sm font-medium border transition-colors ${
      active 
        ? category.color 
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
    }`"
  >
    {{ category.name }}
  </button>
</template>

<script setup>
defineProps({
  category: Object,
  active: Boolean
})

defineEmits(['select'])
</script>