<template>
  <div class="h-64 flex items-end justify-between space-x-2">
    <div
      v-for="(value, index) in chartData"
      :key="index"
      class="bg-sage-blue-700 rounded-t flex-1 transition-all duration-300 hover:bg-sage-blue-600 cursor-pointer relative group"
      :style="{ height: `${(value / Math.max(...chartData)) * 100}%` }"
    >
      <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {{ value }}k€
      </div>
    </div>
  </div>
  <div class="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
    <span v-for="label in labels" :key="label">{{ label }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const chartData = ref([45, 52, 38, 67, 73, 89, 94, 76, 82, 95, 87, 91])
const labels = ref(['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'])
</script>