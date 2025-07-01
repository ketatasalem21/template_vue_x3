<template>
  <div :class="`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`">
    <AppHeader
      :dark-mode="darkMode"
      :show-mobile-toggle="showMobileToggle"
      :showing-list="showingList"
      @toggle-dark-mode="toggleDarkMode"
      @open-navigation="showNavigationModal = true"
      @toggle-mobile-view="handleMobileToggle"
    />
    
    <main class="pt-16">
      <component :is="currentComponent" />
    </main>

    <!-- Navigation Modal -->
    <NavigationModal
      :is-open="showNavigationModal"
      @close="showNavigationModal = false"
      @navigate="handleNavigation"
    />
  </div>
</template>

<script setup>
import { ref, watch, provide } from 'vue'
import AppHeader from './components/AppHeader.vue'
import Dashboard from './components/Dashboard.vue'
import ArticleManagement from './components/ArticleManagement.vue'
import DataConsultation from './components/DataConsultation.vue'
import InvoiceManagement from './components/InvoiceManagement.vue'
import NavigationModal from './components/NavigationModal.vue'

const darkMode = ref(false)
const showNavigationModal = ref(false)
const currentView = ref('dashboard')

// Header mobile toggle state
const showMobileToggle = ref(false)
const showingList = ref(true)
const onToggleMobileView = ref(null)

const components = {
  dashboard: Dashboard,
  articles: ArticleManagement,
  consultation: DataConsultation,
  invoices: InvoiceManagement
}

const currentComponent = ref(Dashboard)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const handleNavigation = (view) => {
  currentView.value = view
  currentComponent.value = components[view] || Dashboard
  showNavigationModal.value = false
}

const handleMobileToggle = () => {
  if (onToggleMobileView.value) {
    onToggleMobileView.value()
  }
}

// Provide header controls to child components
provide('headerControls', {
  setShowMobileToggle: (value) => {
    showMobileToggle.value = value
  },
  setShowingList: (value) => {
    showingList.value = value
  },
  onToggleMobileView: onToggleMobileView
})

// Gestion du mode sombre
watch(darkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })
</script>

<script>
export default {
  name: 'App'
}
</script>