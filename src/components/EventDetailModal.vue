<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Détails de l'événement</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div v-if="event" class="p-6 space-y-6">
        <!-- En-tête de l'événement -->
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ event.title }}</h3>
            <div class="flex items-center space-x-3">
              <span :class="`px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyle(event.category)}`">
                {{ getCategoryName(event.category) }}
              </span>
              <span :class="`px-3 py-1 rounded-full text-sm font-medium ${getPriorityStyle(event.priority)}`">
                Priorité {{ getPriorityName(event.priority) }}
              </span>
              <span :class="`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(event.status)}`">
                {{ getStatusName(event.status) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="event.description">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
          <p class="text-gray-700 dark:text-gray-300">{{ event.description }}</p>
        </div>

        <!-- Informations temporelles -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Date et heure</h4>
            <div class="space-y-2">
              <div class="flex items-center space-x-2 text-sm">
                <Calendar class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span class="text-gray-700 dark:text-gray-300">{{ formatDate(event.startTime) }}</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <Clock class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span class="text-gray-700 dark:text-gray-300">{{ formatTimeRange(event) }}</span>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <Timer class="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span class="text-gray-700 dark:text-gray-300">Durée: {{ formatDuration(event) }}</span>
              </div>
            </div>
          </div>

          <div v-if="event.location">
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Lieu</h4>
            <div class="flex items-center space-x-2 text-sm">
              <MapPin class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span class="text-gray-700 dark:text-gray-300">{{ event.location }}</span>
            </div>
          </div>
        </div>

        <!-- Participants -->
        <div v-if="event.attendees && event.attendees.length > 0">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Participants ({{ event.attendees.length }})
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="attendee in event.attendees"
              :key="attendee"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {{ attendee }}
            </span>
          </div>
        </div>

        <!-- Actions rapides -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Actions rapides</h4>
          <div class="flex flex-wrap gap-2">
            <button
              @click="$emit('edit', event)"
              class="flex items-center space-x-2 px-3 py-2 bg-sage-blue-600 text-white rounded hover:bg-sage-blue-700 transition-colors text-sm"
            >
              <Edit class="w-4 h-4" />
              <span>Modifier</span>
            </button>
            <button
              @click="duplicateEvent"
              class="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              <Copy class="w-4 h-4" />
              <span>Dupliquer</span>
            </button>
            <button
              @click="$emit('delete', event.id)"
              class="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
            >
              <Trash2 class="w-4 h-4" />
              <span>Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  X, Calendar, Clock, Timer, MapPin, Edit, Copy, Trash2 
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  event: Object
})

defineEmits(['close', 'edit', 'delete'])

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTimeRange = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

const formatDuration = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  const duration = (end - start) / (1000 * 60) // durée en minutes
  
  if (duration < 60) {
    return `${duration} minutes`
  } else {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`
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
    high: 'haute',
    medium: 'moyenne',
    low: 'faible'
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

const duplicateEvent = () => {
  console.log('Duplicate event:', props.event)
  // Logique de duplication
}
</script>