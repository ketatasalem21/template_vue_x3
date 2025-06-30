<template>
  <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
    <div class="flex items-center space-x-3">
      <div :class="`w-3 h-3 rounded-full ${getStatusColor(quality.status)}`"></div>
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ quality.test }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">Cible: {{ quality.target }}%</p>
      </div>
    </div>
    <div class="text-right">
      <span :class="`text-sm font-medium ${getResultColor(quality.status)}`">
        {{ quality.result }}%
      </span>
      <div class="flex items-center mt-1">
        <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
          <div 
            :class="`h-1.5 rounded-full transition-all duration-300 ${getProgressColor(quality.status)}`"
            :style="{ width: `${Math.min(quality.result, 100)}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  quality: Object
})

const getStatusColor = (status) => {
  const colors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    poor: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getResultColor = (status) => {
  const colors = {
    excellent: 'text-green-600 dark:text-green-400',
    good: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    poor: 'text-red-600 dark:text-red-400'
  }
  return colors[status] || 'text-gray-600'
}

const getProgressColor = (status) => {
  const colors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    poor: 'bg-red-500'
  }
  return colors[status] || 'bg-gray-400'
}
</script>