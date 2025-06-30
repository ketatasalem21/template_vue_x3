<template>
  <div class="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
    <div :class="`w-8 h-8 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`">
      <component :is="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900 dark:text-white">
        <span class="font-medium">{{ activity.user }}</span>
        {{ activity.action }}
        <span class="font-medium text-sage-blue-700">{{ activity.item }}</span>
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ activity.time }}</p>
    </div>
  </div>
</template>

<script setup>
import { Plus, Edit, Trash2, Check } from 'lucide-vue-next'

defineProps({
  activity: Object
})

const getActivityColor = (type) => {
  const colors = {
    create: 'bg-green-500',
    update: 'bg-blue-500',
    delete: 'bg-red-500',
    approve: 'bg-purple-500'
  }
  return colors[type] || 'bg-gray-500'
}

const getActivityIcon = (type) => {
  const icons = {
    create: Plus,
    update: Edit,
    delete: Trash2,
    approve: Check
  }
  return icons[type] || Plus
}
</script>