<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full m-0 rounded-none
        sm:rounded-lg sm:max-w-6xl sm:max-h-[90vh] sm:m-4"
    >
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-sage-blue-700 to-blue-600">
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
          <div class="flex items-center space-x-4 mb-2 sm:mb-0">
            <Calendar class="w-6 h-6 text-white" />
            <h2 class="text-xl font-semibold text-white">Calendrier des Événements</h2>
            <div class="text-sage-blue-100 text-sm">
              {{ currentUser }} - {{ formatDate(selectedDate, 'full') }}
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            @click="goToToday"
            class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
          >
            Aujourd'hui
          </button>
          <button
            @click="showCreateEvent = true"
            class="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
          >
            <Plus class="w-4 h-4 inline mr-1" />
            Nouvel événement
          </button>
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Navigation et vues -->
      <div class="flex flex-col sm:flex-row items-start justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
          <!-- Navigation mois -->
          <div class="flex items-center space-x-2 mb-2 sm:mb-0">
            <button
              @click="previousMonth"
              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              title="Mois précédent"
            >
              <ChevronLeft class="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white min-w-48 text-center">
              {{ formatDate(currentDate, 'month-year') }}
            </h3>
            <button
              @click="nextMonth"
              class="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
              title="Mois suivant"
            >
              <ChevronRight class="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <!-- Sélecteur de vue -->
          <div class="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 mb-2 sm:mb-0">
            <button
              v-for="view in views"
              :key="view.id"
              @click="currentView = view.id"
              :class="`px-3 py-1 text-sm transition-colors ${
                currentView === view.id
                  ? 'bg-sage-blue-700 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${view.id === 'month' ? 'rounded-l-lg' : view.id === 'agenda' ? 'rounded-r-lg' : ''}`"
            >
              {{ view.label }}
            </button>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto mt-2 sm:mt-0">
          <div class="relative w-full sm:w-auto">
            <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Rechercher un événement..."
              class="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 w-full sm:w-auto"
            />
          </div>
          <select
            v-model="selectedCategory"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 w-full sm:w-auto"
          >
            <option value="">Toutes les catégories</option>
            <option v-for="category in eventCategories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="flex flex-col sm:flex-row h-[calc(100vh-220px)] sm:h-[calc(90vh-160px)]">
        <!-- Vue calendrier -->
        <div class="flex-1 overflow-hidden">
          <!-- Vue Mois -->
          <div v-if="currentView === 'month'" class="h-full p-3 sm:p-4">
            <CalendarMonthView
              :current-date="currentDate"
              :events="filteredEvents"
              :selected-date="selectedDate"
              @date-click="handleDateClick"
              @event-click="handleEventClick"
            />
          </div>

          <!-- Vue Semaine -->
          <div v-else-if="currentView === 'week'" class="h-full p-3 sm:p-4">
            <CalendarWeekView
              :current-date="currentDate"
              :events="filteredEvents"
              :selected-date="selectedDate"
              @date-click="handleDateClick"
              @event-click="handleEventClick"
            />
          </div>

          <!-- Vue Jour -->
          <div v-else-if="currentView === 'day'" class="h-full p-3 sm:p-4">
            <CalendarDayView
              :current-date="selectedDate"
              :events="filteredEvents"
              @event-click="handleEventClick"
            />
          </div>

          <!-- Vue Agenda -->
          <div v-else-if="currentView === 'agenda'" class="h-full p-3 sm:p-4">
            <CalendarAgendaView
              :events="filteredEvents"
              :search-term="searchTerm"
              @event-click="handleEventClick"
            />
          </div>
        </div>

        <!-- Sidebar droite -->
        <div class="w-full sm:w-80 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 overflow-y-auto">
          <div class="p-3 sm:p-4 space-y-6">
            <!-- Mini calendrier -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Navigation rapide</h4>
              <MiniCalendar
                :current-date="currentDate"
                :selected-date="selectedDate"
                :events="events"
                @date-select="handleMiniCalendarDateSelect"
                @month-change="handleMiniCalendarMonthChange"
              />
            </div>

            <!-- Événements du jour sélectionné -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Événements du {{ formatDate(selectedDate, 'day-month') }}
              </h4>
              <div class="space-y-2 max-h-64 overflow-y-auto">
                <div
                  v-for="event in selectedDateEvents"
                  :key="event.id"
                  @click="handleEventClick(event)"
                  :class="`p-3 rounded-lg border-l-4 cursor-pointer transition-colors hover:bg-white dark:hover:bg-gray-600 ${
                    getCategoryColor(event.category)
                  }`"
                >
                  <div class="font-medium text-gray-900 dark:text-white text-sm">{{ event.title }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}
                  </div>
                  <div v-if="event.location" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin class="w-3 h-3 inline mr-1" />
                    {{ event.location }}
                  </div>
                </div>
                <div v-if="selectedDateEvents.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CalendarDays class="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p class="text-sm">Aucun événement ce jour</p>
                </div>
              </div>
            </div>

            <!-- Catégories -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Catégories</h4>
              <div class="space-y-2">
                <label
                  v-for="category in eventCategories"
                  :key="category.id"
                  class="flex items-center space-x-3 cursor-pointer hover:bg-white dark:hover:bg-gray-600 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    :checked="visibleCategories.includes(category.id)"
                    @change="toggleCategoryVisibility(category.id)"
                    class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
                  />
                  <div :class="`w-3 h-3 rounded-full ${category.color}`"></div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                    {{ getCategoryEventCount(category.id) }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Statistiques -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Statistiques</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Ce mois</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ monthEventCount }} événements</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Cette semaine</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ weekEventCount }} événements</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600 dark:text-gray-400">Aujourd'hui</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ todayEventCount }} événements</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <EventDetailModal
        :is-open="showEventDetail"
        :event="selectedEvent"
        @close="showEventDetail = false"
        @edit="handleEditEvent"
        @delete="handleDeleteEvent"
      />

      <CreateEventModal
        :is-open="showCreateEvent"
        :initial-date="selectedDate"
        :categories="eventCategories"
        @close="showCreateEvent = false"
        @save="handleCreateEvent"
      />

      <EditEventModal
        :is-open="showEditEvent"
        :event="selectedEvent"
        :categories="eventCategories"
        @close="showEditEvent = false"
        @save="handleUpdateEvent"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Calendar, X, Plus, ChevronLeft, ChevronRight, Search, MapPin, CalendarDays
} from 'lucide-vue-next'
import CalendarMonthView from './CalendarMonthView.vue'
import CalendarWeekView from './CalendarWeekView.vue'
import CalendarDayView from './CalendarDayView.vue'
import CalendarAgendaView from './CalendarAgendaView.vue'
import MiniCalendar from './MiniCalendar.vue'
import EventDetailModal from './EventDetailModal.vue'
import CreateEventModal from './CreateEventModal.vue'
import EditEventModal from './EditEventModal.vue'

defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

// État du composant
const currentDate = ref(new Date())
const selectedDate = ref(new Date())
const currentView = ref('month')
const searchTerm = ref('')
const selectedCategory = ref('')
const visibleCategories = ref(['work', 'personal', 'meeting', 'maintenance', 'training'])
const currentUser = ref('SALEM KETATA')

// Modals
const showEventDetail = ref(false)
const showCreateEvent = ref(false)
const showEditEvent = ref(false)
const selectedEvent = ref(null)

// Vues disponibles
const views = ref([
  { id: 'month', label: 'Mois' },
  { id: 'week', label: 'Semaine' },
  { id: 'day', label: 'Jour' },
  { id: 'agenda', label: 'Agenda' }
])

// Catégories d'événements
const eventCategories = ref([
  { id: 'work', name: 'Travail', color: 'bg-blue-500' },
  { id: 'personal', name: 'Personnel', color: 'bg-green-500' },
  { id: 'meeting', name: 'Réunions', color: 'bg-purple-500' },
  { id: 'maintenance', name: 'Maintenance', color: 'bg-orange-500' },
  { id: 'training', name: 'Formation', color: 'bg-indigo-500' },
  { id: 'holiday', name: 'Congés', color: 'bg-pink-500' }
])

// Événements d'exemple
const events = ref([
  {
    id: '1',
    title: 'Réunion équipe production',
    description: 'Point hebdomadaire sur les objectifs de production',
    startTime: '2024-01-22T09:00:00',
    endTime: '2024-01-22T10:30:00',
    category: 'meeting',
    location: 'Salle de réunion A',
    attendees: ['Marie Dubois', 'Jean Martin', 'Sophie Laurent'],
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: '2',
    title: 'Maintenance préventive Bain Chrome #2',
    description: 'Contrôle et ajustement des paramètres du bain de chromage',
    startTime: '2024-01-22T14:00:00',
    endTime: '2024-01-22T16:00:00',
    category: 'maintenance',
    location: 'Atelier galvanoplastie',
    attendees: ['Pierre Durand'],
    priority: 'medium',
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Formation sécurité',
    description: 'Formation obligatoire sur les nouvelles procédures de sécurité',
    startTime: '2024-01-23T10:00:00',
    endTime: '2024-01-23T12:00:00',
    category: 'training',
    location: 'Salle de formation',
    attendees: ['Équipe complète'],
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: '4',
    title: 'Contrôle qualité lot #2024-0156',
    description: 'Inspection finale et validation du lot de production',
    startTime: '2024-01-23T15:30:00',
    endTime: '2024-01-23T16:30:00',
    category: 'work',
    location: 'Laboratoire qualité',
    attendees: ['Anne Moreau'],
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: '5',
    title: 'Rendez-vous médical',
    description: 'Visite médicale annuelle',
    startTime: '2024-01-24T14:00:00',
    endTime: '2024-01-24T15:00:00',
    category: 'personal',
    location: 'Cabinet médical',
    attendees: [],
    priority: 'medium',
    status: 'confirmed'
  },
  {
    id: '6',
    title: 'Audit qualité ISO',
    description: 'Audit annuel de certification ISO 9001',
    startTime: '2024-01-25T08:00:00',
    endTime: '2024-01-25T17:00:00',
    category: 'work',
    location: 'Ensemble des ateliers',
    attendees: ['Auditeur externe', 'Direction'],
    priority: 'high',
    status: 'confirmed'
  },
  {
    id: '7',
    title: 'Congés',
    description: 'Congés payés',
    startTime: '2024-01-26T00:00:00',
    endTime: '2024-01-26T23:59:59',
    category: 'holiday',
    location: '',
    attendees: [],
    priority: 'low',
    status: 'confirmed'
  }
])

// Computed properties
const filteredEvents = computed(() => {
  let filtered = events.value.filter(event => 
    visibleCategories.value.includes(event.category)
  )

  if (selectedCategory.value) {
    filtered = filtered.filter(event => event.category === selectedCategory.value)
  }

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(event =>
      event.title.toLowerCase().includes(search) ||
      event.description.toLowerCase().includes(search) ||
      event.location.toLowerCase().includes(search)
    )
  }

  return filtered
})

const selectedDateEvents = computed(() => {
  const dateStr = selectedDate.value.toISOString().split('T')[0]
  return filteredEvents.value.filter(event => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    return eventDate === dateStr
  })
})

const monthEventCount = computed(() => {
  const currentMonth = currentDate.value.getMonth()
  const currentYear = currentDate.value.getFullYear()
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  }).length
})

const weekEventCount = computed(() => {
  const startOfWeek = new Date(currentDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(endOfWeek.getDate() + 6)
  
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime)
    return eventDate >= startOfWeek && eventDate <= endOfWeek
  }).length
})

const todayEventCount = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return events.value.filter(event => {
    const eventDate = new Date(event.startTime).toISOString().split('T')[0]
    return eventDate === today
  }).length
})

// Méthodes
const formatDate = (date, format) => {
  const options = {
    'full': { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    'month-year': { year: 'numeric', month: 'long' },
    'day-month': { day: 'numeric', month: 'long' }
  }
  return date.toLocaleDateString('fr-FR', options[format])
}

const formatTime = (timeString) => {
  return new Date(timeString).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const getCategoryColor = (categoryId) => {
  const category = eventCategories.value.find(c => c.id === categoryId)
  return category ? `border-l-${category.color.replace('bg-', '')}` : 'border-l-gray-400'
}

const getCategoryEventCount = (categoryId) => {
  return events.value.filter(event => event.category === categoryId).length
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const goToToday = () => {
  const today = new Date()
  currentDate.value = today
  selectedDate.value = today
}

const handleDateClick = (date) => {
  selectedDate.value = date
}

const handleEventClick = (event) => {
  selectedEvent.value = event
  showEventDetail.value = true
}

const handleMiniCalendarDateSelect = (date) => {
  selectedDate.value = date
  if (currentView.value === 'day') {
    currentDate.value = date
  }
}

const handleMiniCalendarMonthChange = (date) => {
  currentDate.value = date
}

const toggleCategoryVisibility = (categoryId) => {
  const index = visibleCategories.value.indexOf(categoryId)
  if (index > -1) {
    visibleCategories.value.splice(index, 1)
  } else {
    visibleCategories.value.push(categoryId)
  }
}

const handleCreateEvent = (eventData) => {
  const newEvent = {
    id: Date.now().toString(),
    ...eventData,
    status: 'confirmed'
  }
  events.value.push(newEvent)
  showCreateEvent.value = false
}

const handleEditEvent = (event) => {
  selectedEvent.value = event
  showEventDetail.value = false
  showEditEvent.value = true
}

const handleUpdateEvent = (updatedEvent) => {
  const index = events.value.findIndex(e => e.id === updatedEvent.id)
  if (index > -1) {
    events.value[index] = updatedEvent
  }
  showEditEvent.value = false
}

const handleDeleteEvent = (eventId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
    const index = events.value.findIndex(e => e.id === eventId)
    if (index > -1) {
      events.value.splice(index, 1)
    }
    showEventDetail.value = false
  }
}

onMounted(() => {
  // Initialisation
})
</script>