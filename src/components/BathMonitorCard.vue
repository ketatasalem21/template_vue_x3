<template>
  <div :class="`bg-white dark:bg-gray-800 border-l-4 ${getBorderColor(bath.status)} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow`">
    <div class="flex items-center justify-between mb-3">
      <div>
        <h4 class="font-semibold text-gray-900 dark:text-white text-sm">{{ bath.name }}</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ bath.chain }}</p>
      </div>
      <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(bath.status)}`">
        {{ getStatusText(bath.status) }}
      </span>
    </div>
    
    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-300">Température</span>
        <span :class="`font-medium ${getTemperatureColor(bath.temperature, bath.type)}`">
          {{ bath.temperature }}°C
        </span>
      </div>
      
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-300">pH</span>
        <span :class="`font-medium ${getPhColor(bath.ph, bath.type)}`">
          {{ bath.ph }}
        </span>
      </div>
      
      <div class="flex items-center justify-between text-sm">
        <span class="text-gray-600 dark:text-gray-300">Concentration</span>
        <span :class="`font-medium ${getConcentrationColor(bath.concentration)}`">
          {{ bath.concentration }}%
        </span>
      </div>
      
      <div class="pt-2 border-t border-gray-200 dark:border-gray-600">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Dernière maintenance</span>
          <span>{{ formatDate(bath.lastMaintenance) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bath: Object
})

const getBorderColor = (status) => {
  const colors = {
    active: 'border-green-500',
    warning: 'border-yellow-500',
    maintenance: 'border-red-500',
    idle: 'border-gray-400'
  }
  return colors[status] || 'border-gray-400'
}

const getStatusBadge = (status) => {
  const badges = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    maintenance: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    idle: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    active: 'Actif',
    warning: 'Attention',
    maintenance: 'Maintenance',
    idle: 'Arrêté'
  }
  return texts[status] || 'Inconnu'
}

const getTemperatureColor = (temp, type) => {
  // Plages optimales par type de bain
  const ranges = {
    'Nickelage': { min: 50, max: 55 },
    'Chromage': { min: 45, max: 50 },
    'Cuivrage': { min: 20, max: 30 },
    'Zingage': { min: 20, max: 25 },
    'Argenture': { min: 15, max: 20 },
    'Dorure': { min: 60, max: 70 },
    'Étamage': { min: 30, max: 40 },
    'Passivation': { min: 25, max: 30 }
  }
  
  const range = ranges[type] || { min: 20, max: 60 }
  
  if (temp >= range.min && temp <= range.max) {
    return 'text-green-600 dark:text-green-400'
  } else if (temp < range.min - 5 || temp > range.max + 5) {
    return 'text-red-600 dark:text-red-400'
  } else {
    return 'text-yellow-600 dark:text-yellow-400'
  }
}

const getPhColor = (ph, type) => {
  // Plages optimales de pH par type de bain
  const ranges = {
    'Nickelage': { min: 4.0, max: 4.5 },
    'Chromage': { min: 3.5, max: 4.0 },
    'Cuivrage': { min: 0.3, max: 0.8 },
    'Zingage': { min: 6.0, max: 6.5 },
    'Argenture': { min: 7.0, max: 7.5 },
    'Dorure': { min: 4.0, max: 5.0 },
    'Étamage': { min: 2.0, max: 2.5 },
    'Passivation': { min: 1.5, max: 2.0 }
  }
  
  const range = ranges[type] || { min: 6.5, max: 7.5 }
  
  if (ph >= range.min && ph <= range.max) {
    return 'text-green-600 dark:text-green-400'
  } else {
    return 'text-red-600 dark:text-red-400'
  }
}

const getConcentrationColor = (concentration) => {
  if (concentration >= 80) {
    return 'text-green-600 dark:text-green-400'
  } else if (concentration >= 60) {
    return 'text-yellow-600 dark:text-yellow-400'
  } else {
    return 'text-red-600 dark:text-red-400'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
  })
}
</script>