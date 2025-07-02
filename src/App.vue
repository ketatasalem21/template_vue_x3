<template>
  <div :class="`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`">
    <AppHeader
      :dark-mode="darkMode"
      :show-view-toggle="currentView === 'articles'"
      :current-view="articleViewState"
      @toggle-dark-mode="toggleDarkMode"
      @open-navigation="showNavigationModal = true"
      @toggle-view="handleToggleView"
    />
    
    <main class="pt-16">
      <component :is="currentComponent" ref="currentComponentRef" :current-view="articleViewState" />
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
import { ref, watch, computed, nextTick, markRaw } from 'vue'
import AppHeader from './components/AppHeader.vue'
import Dashboard from './components/Dashboard.vue'
import ArticleManagement from './components/ArticleManagement.vue'
import DataConsultation from './components/DataConsultation.vue'
import InvoiceManagement from './components/InvoiceManagement.vue'
import NavigationModal from './components/NavigationModal.vue'

const darkMode = ref(false)
const showNavigationModal = ref(false)
const currentView = ref('dashboard')
const currentComponentRef = ref(null)
const articleViewState = ref('') // État local pour la vue des articles

const components = {
  dashboard: markRaw(Dashboard),
  articles: markRaw(ArticleManagement),
  consultation: markRaw(DataConsultation),
  invoices: markRaw(InvoiceManagement)
}

const currentComponent = ref(components.dashboard)

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value
}

const handleNavigation = (view) => {
  currentView.value = view
  currentComponent.value = markRaw(components[view] || Dashboard)
  showNavigationModal.value = false
  
  // Réinitialiser la vue des articles si on navigue vers les articles
  if (view === 'articles') {
    articleViewState.value = 'data'
  }
}

// Gestion du basculement entre les vues data/form
const handleToggleView = () => {
  console.log('handleToggleView called, currentView:', currentView.value)
  if (currentView.value === 'articles') {
    console.log('Current articleViewState:', articleViewState.value)
    articleViewState.value = articleViewState.value === 'data' ? 'form' : 'data'
    console.log('New articleViewState:', articleViewState.value)
    
    // Appeler la méthode toggleView du composant ArticleManagement
    nextTick(() => {
      console.log('currentComponentRef.value:', currentComponentRef.value)
      if (currentComponentRef.value?.toggleView) {
        console.log('Calling toggleView on ArticleManagement')
        currentComponentRef.value.toggleView()
      } else {
        console.log('toggleView method not found on currentComponentRef')
      }
    })
  } else {
    console.log('Not in articles view, currentView:', currentView.value)
  }
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