<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div class="flex items-center space-x-3">
      <div :class="`w-3 h-3 rounded-full ${getStatusColor(process.status)}`"></div>
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ process.name }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ getStatusText(process.status) }}</p>
      </div>
    </div>
    <div class="text-right">
      <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
        <div 
          :class="`h-2 rounded-full transition-all duration-300 ${process.color}`"
          :style="{ width: `${process.progress}%` }"
        ></div>
      </div>
      <span class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ process.progress }}%</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  process: Object
})

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-500',
    warning: 'bg-yellow-500',
    maintenance: 'bg-red-500',
    idle: 'bg-gray-400'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusText = (status) => {
  const texts = {
    active: 'En cours',
    warning: 'Attention',
    maintenance: 'Maintenance',
    idle: 'Arrêté'
  }
  return texts[status] || 'Inconnu'
}
</script>