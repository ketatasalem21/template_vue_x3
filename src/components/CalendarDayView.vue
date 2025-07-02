<template>
  <div class="h-full flex flex-col">
    <!-- En-tête du jour -->
    <div class="bg-gray-50 dark:bg-gray-700 p-4 mb-4 rounded-lg">
      <div class="text-center">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ formatDayName(currentDate) }}
        </div>
        <div :class="`text-2xl font-bold mt-1 ${
          isToday(currentDate) ? 'text-sage-blue-700 dark:text-sage-blue-400' : 'text-gray-900 dark:text-white'
        }`">
          {{ currentDate.getDate() }}
        </div>
        <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {{ formatMonth(currentDate) }}
        </div>
      </div>
    </div>

    <!-- Grille horaire -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-px">
        <div
          v-for="hour in hours"
          :key="hour"
          class="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"
        >
          <!-- Heure -->
          <div class="w-20 p-3 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
            {{ formatHour(hour) }}
          </div>

          <!-- Zone d'événements -->
          <div class="flex-1 p-2 relative min-h-16">
            <div
              v-for="event in getHourEvents(hour)"
              :key="event.id"
              @click="$emit('eventClick', event)"
              :class="`p-3 rounded-lg cursor-pointer hover:shadow-md transition-all ${
                getCategoryStyle(event.category)
              }`"
              :style="getEventStyle(event)"
            >
              <div class="font-medium">{{ event.title }}</div>
              <div class="text-sm opacity-75 mt-1">{{ formatEventTime(event) }}</div>
              <div v-if="event.location" class="text-sm opacity-75 mt-1">
                <MapPin class="w-3 h-3 inline mr-1" />
                {{ event.location }}
              </div>
              <div v-if="event.attendees.length > 0" class="text-sm opacity-75 mt-1">
                <Users class="w-3 h-3 inline mr-1" />
                {{ event.attendees.length }} participant{{ event.attendees.length > 1 ? 's' : '' }}
              </div>
            </div>

            <!-- Zone de clic pour créer un événement -->
            <div
              v-if="getHourEvents(hour).length === 0"
              @click="handleTimeSlotClick(hour)"
              class="absolute inset-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer rounded"
            >
              <div class="flex items-center justify-center h-full text-gray-400 dark:text-gray-600 text-sm">
                Cliquer pour ajouter un événement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { MapPin, Users } from 'lucide-vue-next'

const props = defineProps({
  currentDate: Date,
  events: Array
})

defineEmits(['eventClick'])

const hours = Array.from({ length: 24 }, (_, i) => i)

const formatDayName = (date) => {
  return date.toLocaleDateString('fr-FR', { weekday: 'long' })
}

const formatMonth = (date) => {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const formatHour = (hour) => {
  return `${hour.toString().padStart(2, '0')}:00`
}

const formatEventTime = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  return `${start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
}

const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const getHourEvents = (hour) => {
  const dateStr = props.currentDate.toISOString().split('T')[0]
  return props.events.filter(event => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    const eventHour = new Date(event.startTime).getHours()
    return eventDate === dateStr && eventHour === hour
  })
}

const getEventStyle = (event) => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  const duration = (end - start) / (1000 * 60 * 60) // durée en heures
  
  return {
    marginBottom: duration > 1 ? '8px' : '4px'
  }
}

const getCategoryStyle = (category) => {
  const styles = {
    work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-l-4 border-blue-500',
    personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-l-4 border-green-500',
    meeting: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-l-4 border-purple-500',
    maintenance: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-l-4 border-orange-500',
    training: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 border-l-4 border-indigo-500',
    holiday: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200 border-l-4 border-pink-500'
  }
  return styles[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-l-4 border-gray-500'
}

const handleTimeSlotClick = (hour) => {
  console.log('Create event at hour:', hour)
  // Émettre un événement pour créer un nouvel événement à cette heure
}
</script>