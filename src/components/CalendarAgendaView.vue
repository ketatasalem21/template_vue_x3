<template>
  <div class="h-full flex flex-col">
    <!-- Filtres et tri -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          Agenda des événements
        </h3>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          {{ filteredEvents.length }} événement{{ filteredEvents.length > 1 ? 's' : '' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-2">
        <select
          v-model="sortBy"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="date">Trier par date</option>
          <option value="category">Trier par catégorie</option>
          <option value="priority">Trier par priorité</option>
        </select>
        
        <button
          @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
          class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          :title="sortOrder === 'asc' ? 'Tri croissant' : 'Tri décroissant'"
        >
          <ArrowUpDown class="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>

    <!-- Liste des événements -->
    <div class="flex-1 overflow-y-auto space-y-4">
      <!-- Groupement par date -->
      <div
        v-for="(dayEvents, date) in groupedEvents"
        :key="date"
        class="space-y-3"
      >
        <!-- En-tête de date -->
        <div class="sticky top-0 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
          <h4 class="font-semibold text-gray-900 dark:text-white">
            {{ formatDateHeader(date) }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ dayEvents.length }} événement{{ dayEvents.length > 1 ? 's' : '' }}
          </p>
        </div>

        <!-- Événements du jour -->
        <div class="space-y-2 ml-4">
          <div
            v-for="event in dayEvents"
            :key="event.id"
            @click="$emit('eventClick', event)"
            :class="`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all ${
              getCategoryBorderStyle(event.category)
            }`"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <!-- Titre et heure -->
                <div class="flex items-center space-x-3 mb-2">
                  <h5 class="font-medium text-gray-900 dark:text-white">{{ event.title }}</h5>
                  <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(event.category)}`">
                    {{ getCategoryName(event.category) }}
                  </span>
                  <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(event.priority)}`">
                    {{ getPriorityName(event.priority) }}
                  </span>
                </div>

                <!-- Heure -->
                <div class="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div class="flex items-center space-x-1">
                    <Clock class="w-4 h-4" />
                    <span>{{ formatEventTime(event) }}</span>
                  </div>
                  <div class="flex items-center space-x-1">
                    <Calendar class="w-4 h-4" />
                    <span>{{ formatEventDuration(event) }}</span>
                  </div>
                </div>

                <!-- Description -->
                <p v-if="event.description" class="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {{ event.description }}
                </p>

                <!-- Détails supplémentaires -->
                <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div v-if="event.location" class="flex items-center space-x-1">
                    <MapPin class="w-4 h-4" />
                    <span>{{ event.location }}</span>
                  </div>
                  <div v-if="event.attendees.length > 0" class="flex items-center space-x-1">
                    <Users class="w-4 h-4" />
                    <span>{{ event.attendees.length }} participant{{ event.attendees.length > 1 ? 's' : '' }}</span>
                  </div>
                </div>
              </div>

              <!-- Statut -->
              <div class="flex flex-col items-end space-y-2">
                <span :class="`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(event.status)}`">
                  {{ getStatusName(event.status) }}
                </span>
                <button
                  @click.stop="$emit('eventClick', event)"
                  class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                  <MoreHorizontal class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-if="filteredEvents.length === 0" class="text-center py-12">
        <CalendarDays class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun événement trouvé</h3>
        <p class="text-gray-500 dark:text-gray-400">
          {{ searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Aucun événement planifié pour le moment' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Clock, Calendar, MapPin, Users, ArrowUpDown, MoreHorizontal, CalendarDays
} from 'lucide-vue-next'

const props = defineProps({
  events: Array,
  searchTerm: String
})

defineEmits(['eventClick'])

const sortBy = ref('date')
const sortOrder = ref('asc')

const filteredEvents = computed(() => {
  let filtered = [...props.events]

  // Tri
  filtered.sort((a, b) => {
    let aValue, bValue

    switch (sortBy.value) {
      case 'date':
        aValue = new Date(a.startTime)
        bValue = new Date(b.startTime)
        break
      case 'category':
        aValue = a.category
        bValue = b.category
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority] || 0
        bValue = priorityOrder[b.priority] || 0
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return filtered
})

const groupedEvents = computed(() => {
  const groups = {}
  
  filteredEvents.value.forEach(event => {
    const date = new Date(event.startTime).toISOString().split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
  })
  
  return groups
})

const formatDateHeader = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  if (date.toDateString() === today.toDateString()) {
    return "Aujourd'hui"
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Demain"
  } else {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    })
  }
}

const formatEventTime = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

const formatEventDuration = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  const duration = (end - start) / (1000 * 60) // durée en minutes
  
  if (duration < 60) {
    return `${duration} min`
  } else {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return minutes > 0 ? `${hours}h${minutes}` : `${hours}h`
  }
}

const getCategoryStyle = (category) => {
  const styles = {
    work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    meeting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    training: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    holiday: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
  }
  return styles[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getCategoryBorderStyle = (category) => {
  const styles = {
    work: 'border-l-4 border-l-blue-500',
    personal: 'border-l-4 border-l-green-500',
    meeting: 'border-l-4 border-l-purple-500',
    maintenance: 'border-l-4 border-l-orange-500',
    training: 'border-l-4 border-l-indigo-500',
    holiday: 'border-l-4 border-l-pink-500'
  }
  return styles[category] || 'border-l-4 border-l-gray-500'
}

const getPriorityStyle = (priority) => {
  const styles = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return styles[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusStyle = (status) => {
  const styles = {
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getCategoryName = (category) => {
  const names = {
    work: 'Travail',
    personal: 'Personnel',
    meeting: 'Réunion',
    maintenance: 'Maintenance',
    training: 'Formation',
    holiday: 'Congés'
  }
  return names[category] || category
}

const getPriorityName = (priority) => {
  const names = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Faible'
  }
  return names[priority] || priority
}

const getStatusName = (status) => {
  const names = {
    confirmed: 'Confirmé',
    pending: 'En attente',
    cancelled: 'Annulé'
  }
  return names[status] || status
}
</script>