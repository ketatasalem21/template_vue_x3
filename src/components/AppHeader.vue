<template>
  <header class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm z-50">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-sage-blue-700 rounded flex items-center justify-center">
            <span class="text-white font-bold text-sm">S</span>
          </div>
          <span class="text-gray-900 dark:text-white font-semibold">Sage</span>
          <span class="text-gray-500 dark:text-gray-400 ml-2">X3</span>
        </div>
        <button
          @click="showCalendar = true"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-sage-blue-700 dark:hover:text-sage-blue-400 transition-colors"
          title="Calendrier"
        >
          <Calendar class="w-5 h-5" />
        </button>
      </div>

      <div class="flex items-center space-x-4">
        <span class="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">SALEM KETATA</span>
        <span class="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">Super administrateur</span>
        <span class="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hidden lg:inline">X3V12/X3</span>

        <!-- Bouton de basculement vue Data/Form (mobile uniquement) -->
        <button
          v-if="showViewToggle"
          @click="$emit('toggleView')"
          class="lg:hidden p-2 text-gray-500 dark:text-gray-400 hover:text-sage-blue-700 dark:hover:text-sage-blue-400 transition-colors"
          :title="currentView === 'data' ? 'Passer au formulaire' : 'Passer aux données'"
        >
          <Database v-if="currentView === 'data'" class="w-5 h-5" />
          <FileText v-else class="w-5 h-5" />
        </button>

        <!-- Navigation Compass Button -->
        <button
          @click="$emit('openNavigation')"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-sage-blue-700 dark:hover:text-sage-blue-400 transition-colors"
          title="Navigation"
        >
          <Compass class="w-5 h-5" />
        </button>

        <button
          @click="$emit('toggleDarkMode')"
          class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          :title="darkMode ? 'Mode clair' : 'Mode sombre'"
        >
          <Sun v-if="darkMode" class="w-4 h-4" />
          <Moon v-else class="w-4 h-4" />
        </button>

        <HelpCircle class="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
        <Star class="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
        <Settings class="w-4 h-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
        <Search class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <X class="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
    </div>

    <!-- Calendar Modal -->
    <CalendarModal
      :is-open="showCalendar"
      @close="showCalendar = false"
    />
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  Calendar,
  Search,
  HelpCircle,
  Star,
  Settings,
  Sun,
  Moon,
  Compass,
  X,
  Database,
  FileText
} from 'lucide-vue-next'
import CalendarModal from './CalendarModal.vue'

defineProps({
  darkMode: Boolean,
  showViewToggle: {
    type: Boolean,
    default: false
  },
  currentView: {
    type: String,
    default: 'data'
  }
})

defineEmits(['toggleDarkMode', 'openNavigation', 'toggleView'])

const showCalendar = ref(false)
</script>