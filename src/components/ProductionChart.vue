<template>
  <div class="space-y-4">
    <!-- Chart -->
    <div class="h-64 flex items-end justify-between space-x-1">
      <div
        v-for="(day, index) in filteredChartData"
        :key="index"
        class="flex flex-col items-center space-y-2 flex-1"
      >
        <div class="relative w-full flex flex-col items-end space-y-1">
          <!-- Pièces traitées -->
          <div
            class="bg-sage-blue-600 rounded-t w-full transition-all duration-300 hover:bg-sage-blue-500 cursor-pointer relative group"
            :style="{ height: `${(day.processed / Math.max(...filteredChartData.map(d => d.processed))) * 120}px` }"
          >
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ day.processed }} pièces
            </div>
          </div>
          <!-- Défauts -->
          <div
            class="bg-red-500 rounded-t w-full transition-all duration-300 hover:bg-red-400 cursor-pointer relative group"
            :style="{ height: `${(day.defects / Math.max(...filteredChartData.map(d => d.defects))) * 40}px` }"
          >
            <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {{ day.defects }} défauts
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Labels -->
    <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
      <span v-for="(day, index) in filteredChartData" :key="index" class="flex-1 text-center">
        {{ day.label }}
      </span>
    </div>
    
    <!-- Legend -->
    <div class="flex items-center justify-center space-x-6 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-sage-blue-600 rounded"></div>
        <span class="text-gray-600 dark:text-gray-300">Pièces traitées</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-red-500 rounded"></div>
        <span class="text-gray-600 dark:text-gray-300">Défauts</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  chainFilter: {
    type: String,
    default: 'all'
  }
})

const chartData = ref({
  all: [
    { label: 'Lun', processed: 145, defects: 3 },
    { label: 'Mar', processed: 162, defects: 2 },
    { label: 'Mer', processed: 138, defects: 5 },
    { label: 'Jeu', processed: 187, defects: 1 },
    { label: 'Ven', processed: 203, defects: 4 },
    { label: 'Sam', processed: 156, defects: 2 },
    { label: 'Dim', processed: 89, defects: 1 }
  ],
  CTS01: [
    { label: 'Lun', processed: 45, defects: 1 },
    { label: 'Mar', processed: 52, defects: 0 },
    { label: 'Mer', processed: 38, defects: 2 },
    { label: 'Jeu', processed: 67, defects: 0 },
    { label: 'Ven', processed: 73, defects: 1 },
    { label: 'Sam', processed: 46, defects: 1 },
    { label: 'Dim', processed: 29, defects: 0 }
  ],
  CTS02: [
    { label: 'Lun', processed: 38, defects: 1 },
    { label: 'Mar', processed: 42, defects: 1 },
    { label: 'Mer', processed: 35, defects: 2 },
    { label: 'Jeu', processed: 48, defects: 0 },
    { label: 'Ven', processed: 55, defects: 2 },
    { label: 'Sam', processed: 41, defects: 0 },
    { label: 'Dim', processed: 22, defects: 1 }
  ],
  CTS03: [
    { label: 'Lun', processed: 32, defects: 1 },
    { label: 'Mar', processed: 38, defects: 1 },
    { label: 'Mer', processed: 35, defects: 1 },
    { label: 'Jeu', processed: 42, defects: 1 },
    { label: 'Ven', processed: 45, defects: 1 },
    { label: 'Sam', processed: 39, defects: 1 },
    { label: 'Dim', processed: 21, defects: 0 }
  ],
  CTS04: [
    { label: 'Lun', processed: 30, defects: 0 },
    { label: 'Mar', processed: 30, defects: 0 },
    { label: 'Mer', processed: 30, defects: 0 },
    { label: 'Jeu', processed: 30, defects: 0 },
    { label: 'Ven', processed: 30, defects: 0 },
    { label: 'Sam', processed: 30, defects: 0 },
    { label: 'Dim', processed: 17, defects: 0 }
  ]
})

const filteredChartData = computed(() => {
  return chartData.value[props.chainFilter] || chartData.value.all
})
</script>