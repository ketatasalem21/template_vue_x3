<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Sidebar -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        showMobileView ? 'w-full' : 'w-0 lg:w-80',
        showMobileView ? 'block' : 'hidden lg:block'
      ]"
    >
      <AppSidebar 
        :articles="articles" 
        :selected-article="selectedArticle"
        @select-article="handleArticleSelect"
      />
    </div>

    <!-- Main Content -->
    <div 
      :class="[
        'flex-1 transition-all duration-300 ease-in-out',
        showMobileView ? 'hidden lg:block' : 'block'
      ]"
    >
      <MainContent 
        v-if="selectedArticle"
        :article="selectedArticle"
        :articles="articles"
        @select-article="handleArticleSelect"
        @toggle-mobile-view="toggleMobileView"
      />
      <div v-else class="flex items-center justify-center h-full">
        <div class="text-center text-gray-500 dark:text-gray-400">
          <h2 class="text-xl font-semibold mb-2">Sélectionnez un article</h2>
          <p>Choisissez un article dans la liste pour commencer</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppSidebar from './AppSidebar.vue'
import MainContent from './MainContent.vue'

const articles = ref([])
const selectedArticle = ref(null)
const showMobileView = ref(false)

// Sample data
const sampleArticles = [
  {
    id: 1,
    code: 'ART001',
    designation: 'Article de démonstration 1',
    famille: 'Famille A',
    sousCategorie: 'Sous-catégorie 1',
    prixVente: 25.99,
    stock: 150,
    status: 'Actif'
  },
  {
    id: 2,
    code: 'ART002',
    designation: 'Article de démonstration 2',
    famille: 'Famille B',
    sousCategorie: 'Sous-catégorie 2',
    prixVente: 45.50,
    stock: 75,
    status: 'Actif'
  },
  {
    id: 3,
    code: 'ART003',
    designation: 'Article de démonstration 3',
    famille: 'Famille A',
    sousCategorie: 'Sous-catégorie 3',
    prixVente: 12.25,
    stock: 200,
    status: 'Inactif'
  }
]

const handleArticleSelect = (article) => {
  selectedArticle.value = article
  if (window.innerWidth < 1024) {
    showMobileView.value = false
  }
}

const toggleMobileView = () => {
  showMobileView.value = !showMobileView.value
}

onMounted(() => {
  articles.value = sampleArticles
  selectedArticle.value = sampleArticles[0]
  
  // Handle responsive behavior
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      showMobileView.value = false
    }
  }
  
  window.addEventListener('resize', handleResize)
})
</script>