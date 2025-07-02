<template>
  <div class="h-full flex flex-col">
    <!-- En-têtes des jours de la semaine -->
    <div class="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-600 mb-4">
      <div class="bg-gray-50 dark:bg-gray-700 p-3"></div>
      <div
        v-for="date in weekDates"
        :key="date.toISOString()"
        :class="`bg-gray-50 dark:bg-gray-700 p-3 text-center ${
          isToday(date) ? 'bg-sage-blue-50 dark:bg-sage-blue-900/20' : ''
        }`"
      >
        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ formatDayName(date) }}
        </div>
        <div :class="`text-lg font-bold mt-1 ${
          isToday(date) ? 'text-sage-blue-700 dark:text-sage-blue-400' : 'text-gray-900 dark:text-white'
        }`">
          {{ date.getDate() }}
        </div>
      </div>
    </div>

    <!-- Grille horaire -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-8 gap-px bg-gray-200 dark:bg-gray-600">
        <!-- Colonne des heures -->
        <div class="bg-white dark:bg-gray-800">
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-16 border-b border-gray-200 dark:border-gray-700 p-2 text-xs text-gray-500 dark:text-gray-400"
          >
            {{ formatHour(hour) }}
          </div>
        </div>

        <!-- Colonnes des jours -->
        <div
          v-for="date in weekDates"
          :key="date.toISOString()"
          class="bg-white dark:bg-gray-800 relative"
        >
          <!-- Lignes horaires -->
          <div
            v-for="hour in hours"
            :key="hour"
            class="h-16 border-b border-gray-200 dark:border-gray-700 relative"
            @click="handleTimeSlotClick(date, hour)"
          >
            <!-- Événements -->
            <div
              v-for="event in getHourEvents(date, hour)"
              :key="event.id"
              @click.stop="$emit('eventClick', event)"
              :class="`absolute left-1 right-1 rounded text-xs p-1 cursor-pointer hover:opacity-80 transition-opacity z-10 ${
                getCategoryStyle(event.category)
              }`"
              :style="getEventStyle(event)"
            >
              <div class="font-medium truncate">{{ event.title }}</div>
              <div class="text-xs opacity-75">{{ formatEventTime(event) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentDate: Date,
  events: Array,
  selectedDate: Date
})

defineEmits(['dateClick', 'eventClick'])

const hours = Array.from({ length: 24 }, (_, i) => i)

const weekDates = computed(() => {
  const startOfWeek = new Date(props.currentDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  
  const dates = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
})

const formatDayName = (date) => {
  return date.toLocaleDateString('fr-FR', { weekday: 'short' })
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

const getHourEvents = (date, hour) => {
  const dateStr = date.toISOString().split('T')[0]
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
  const startMinutes = start.getMinutes()
  
  return {
    top: `${(startMinutes / 60) * 64}px`,
    height: `${Math.max(duration * 64, 20)}px`
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

const handleTimeSlotClick = (date, hour) => {
  // Créer une nouvelle date avec l'heure sélectionnée
  const selectedDateTime = new Date(date)
  selectedDateTime.setHours(hour, 0, 0, 0)
  emit('dateClick', selectedDateTime)
}
</script>