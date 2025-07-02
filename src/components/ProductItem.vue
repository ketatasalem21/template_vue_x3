<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
    <div class="flex-1">
      <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ product.name }}</h4>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ product.sales }} ventes</p>
    </div>
    <div class="text-right">
      <span :class="`text-sm font-medium ${product.positive ? 'text-green-600' : 'text-red-600'}`">
        {{ product.change }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>