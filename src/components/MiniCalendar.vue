<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 p-3">
    <!-- Navigation -->
    <div class="flex items-center justify-between mb-3">
      <button
        @click="previousMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <ChevronLeft class="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>
      <h5 class="text-sm font-medium text-gray-900 dark:text-white">
        {{ formatMonth(displayDate) }}
      </h5>
      <button
        @click="nextMonth"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
      >
        <ChevronRight class="w-4 h-4 text-gray-600 dark:text-gray-300" />
      </button>
    </div>

    <!-- En-têtes des jours -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div
        v-for="day in dayHeaders"
        :key="day"
        class="text-center text-xs text-gray-500 dark:text-gray-400 font-medium"
      >
        {{ day }}
      </div>
    </div>

    <!-- Grille des dates -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="date in calendarDates"
        :key="date.toISOString()"
        @click="selectDate(date)"
        :class="`w-8 h-8 text-xs rounded transition-colors ${
          isToday(date) 
            ? 'bg-sage-blue-600 text-white font-bold' 
            : isSelectedDate(date)
            ? 'bg-sage-blue-100 text-sage-blue-800 dark:bg-sage-blue-900 dark:text-sage-blue-200'
            : isCurrentMonth(date)
            ? 'text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            : 'text-gray-400 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
        } ${
          hasEvents(date) ? 'font-semibold' : ''
        }`"
      >
        {{ date.getDate() }}
        <div v-if="hasEvents(date)" class="w-1 h-1 bg-current rounded-full mx-auto mt-0.5"></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentDate: Date,
  selectedDate: Date,
  events: Array
})

const emit = defineEmits(['dateSelect', 'monthChange'])

const displayDate = ref(new Date(props.currentDate))
const dayHeaders = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

const calendarDates = computed(() => {
  const year = displayDate.value.getFullYear()
  const month = displayDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDate.getDay())
  
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

const formatMonth = (date) => {
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}

const isToday = (date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

const isSelectedDate = (date) => {
  return date.toDateString() === props.selectedDate.toDateString()
}

const isCurrentMonth = (date) => {
  return date.getMonth() === displayDate.value.getMonth()
}

const hasEvents = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return props.events.some(event => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    return eventDate === dateStr
  })
}

const previousMonth = () => {
  displayDate.value = new Date(displayDate.value.getFullYear(), displayDate.value.getMonth() - 1, 1)
  emit('monthChange', displayDate.value)
}

const nextMonth = () => {
  displayDate.value = new Date(displayDate.value.getFullYear(), displayDate.value.getMonth() + 1, 1)
  emit('monthChange', displayDate.value)
}

const selectDate = (date) => {
  emit('dateSelect', date)
}
</script>