<template>
  <div class="h-full flex flex-col">
    <!-- En-têtes des jours -->
    <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600 mb-2">
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="bg-gray-50 dark:bg-gray-700 p-2 text-center text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grille du calendrier -->
    <div class="flex-1 grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-600">
      <div
        v-for="date in calendarDates"
        :key="date.toISOString()"
        @click="$emit('dateClick', date)"
        :class="`bg-white dark:bg-gray-800 p-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors min-h-24 ${
          isToday(date) ? 'bg-sage-blue-50 dark:bg-sage-blue-900/20' : ''
        } ${
          isSelectedDate(date) ? 'ring-2 ring-sage-blue-500' : ''
        } ${
          !isCurrentMonth(date) ? 'text-gray-400 dark:text-gray-600' : ''
        }`"
      >
        <!-- Numéro du jour -->
        <div class="flex items-center justify-between mb-1">
          <span :class="`text-sm font-medium ${
            isToday(date) ? 'text-sage-blue-700 dark:text-sage-blue-400 font-bold' : 'text-gray-900 dark:text-white'
          }`">
            {{ date.getDate() }}
          </span>
          <div v-if="getDateEventCount(date) > 0" class="flex items-center space-x-1">
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ getDateEventCount(date) }}</span>
            <div class="w-2 h-2 bg-sage-blue-500 rounded-full"></div>
          </div>
        </div>

        <!-- Événements -->
        <div class="space-y-1">
          <div
            v-for="event in getDateEvents(date).slice(0, 3)"
            :key="event.id"
            @click.stop="$emit('eventClick', event)"
            :class="`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
              getCategoryStyle(event.category)
            }`"
          >
            {{ event.title }}
          </div>
          <div
            v-if="getDateEvents(date).length > 3"
            class="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
            @click.stop="$emit('dateClick', date)"
          >
            +{{ getDateEvents(date).length - 3 }} autres
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

const dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

const calendarDates = computed(() => {
  const year = props.currentDate.getFullYear()
  const month = props.currentDate.getMonth()
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1)
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0)
  
  // Premier dimanche à afficher
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
  // Dernier samedi à afficher
  const endDate = new Date(lastDay)
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
  
  const dates = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
})

const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isSelectedDate = (date) => {
  return date.toDateString() === props.selectedDate.toDateString()
}

const isCurrentMonth = (date) => {
  return date.getMonth() === props.currentDate.getMonth()
}

const getDateEvents = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return props.events.filter(event => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    return eventDate === dateStr
  })
}

const getDateEventCount = (date) => {
  return getDateEvents(date).length
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
</script>