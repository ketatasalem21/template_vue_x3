<template>
  <div :class="`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`">
    <AppHeader
      :dark-mode="darkMode"
      @toggle-dark-mode="toggleDarkMode"
      @open-navigation="showNavigationModal = true"
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
import { ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import Dashboard from './components/Dashboard.vue'
import ArticleManagement from './components/ArticleManagement.vue'
import DataConsultation from './components/DataConsultation.vue'
import InvoiceManagement from './components/InvoiceManagement.vue'
import NavigationModal from './components/NavigationModal.vue'

const darkMode = ref(false)
const showNavigationModal = ref(false)
const currentView = ref('dashboard')

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