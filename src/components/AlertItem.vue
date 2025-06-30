<template>
  <div :class="`flex items-start space-x-3 p-3 rounded-lg border-l-4 ${getBorderColor(alert.severity)} bg-gray-50 dark:bg-gray-700`">
    <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${getIconBg(alert.type)}`">
      <component :is="getIcon(alert.type)" class="w-4 h-4 text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 dark:text-white">{{ alert.message }}</p>
      <div class="flex items-center justify-between mt-1">
        <p class="text-xs text-gray-500 dark:text-gray-400">{{ alert.time }}</p>
        <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(alert.severity)}`">
          {{ getSeverityText(alert.severity) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Settings, X } from 'lucide-vue-next'

defineProps({
  alert: Object
})

const getIcon = (type) => {
  const icons = {
    warning: AlertTriangle,
    maintenance: Settings,
    error: X
  }
  return icons[type] || AlertTriangle
}

const getIconBg = (type) => {
  const colors = {
    warning: 'bg-yellow-500',
    maintenance: 'bg-blue-500',
    error: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getBorderColor = (severity) => {
  const colors = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-blue-500'
  }
  return colors[severity] || 'border-gray-400'
}

const getSeverityBadge = (severity) => {
  const badges = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return badges[severity] || 'bg-gray-100 text-gray-800'
}

const getSeverityText = (severity) => {
  const texts = {
    high: 'Critique',
    medium: 'Moyen',
    low: 'Faible'
  }
  return texts[severity] || 'Inconnu'
}
</script>