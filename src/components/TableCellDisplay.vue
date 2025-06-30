<template>
  <div class="flex items-center">
    <!-- Text -->
    <span v-if="type === 'text'" class="text-gray-900 dark:text-white">
      {{ value }}
    </span>

    <!-- Number -->
    <span v-else-if="type === 'number'" class="text-gray-900 dark:text-white font-mono">
      {{ formatNumber(value) }}
    </span>

    <!-- Currency -->
    <span v-else-if="type === 'currency'" class="text-gray-900 dark:text-white font-mono">
      {{ formatCurrency(value) }}
    </span>

    <!-- Date -->
    <span v-else-if="type === 'date'" class="text-gray-900 dark:text-white">
      {{ formatDate(value) }}
    </span>

    <!-- Badge -->
    <span
      v-else-if="type === 'badge'"
      :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(value)}`"
    >
      {{ value }}
    </span>

    <!-- Status -->
    <div v-else-if="type === 'status'" class="flex items-center space-x-2">
      <div :class="`w-2 h-2 rounded-full ${getStatusColor(value)}`"></div>
      <span class="text-gray-900 dark:text-white text-sm">{{ getStatusLabel(value) }}</span>
    </div>

    <!-- Default -->
    <span v-else class="text-gray-900 dark:text-white">
      {{ value }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  value: [String, Number, Boolean],
  type: String,
  row: Object
})

const formatNumber = (value) => {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString('fr-FR')
}

const formatCurrency = (value) => {
  if (value === null || value === undefined) return '-'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value)
}

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('fr-FR')
}

const getBadgeColor = (value) => {
  const colors = {
    'ACH': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'FAB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'FAV': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'FPV': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return colors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusColor = (value) => {
  const colors = {
    'active': 'bg-green-500',
    'inactive': 'bg-red-500',
    'draft': 'bg-yellow-500',
    'archived': 'bg-gray-500'
  }
  return colors[value] || 'bg-gray-400'
}

const getStatusLabel = (value) => {
  const labels = {
    'active': 'Actif',
    'inactive': 'Inactif',
    'draft': 'Brouillon',
    'archived': 'Archivé'
  }
  return labels[value] || value
}
</script>