<template>
  <div class="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full min-w-0">
    <!-- Header avec breadcrumb et boutons de navigation -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <!-- Bouton retour en mobile -->
      <div class="flex items-center justify-between lg:hidden mb-4">
        <button
          @click="$emit('toggleMobileView')"
          class="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft class="w-5 h-5" />
          <span>Retour à la liste</span>
        </button>
      </div>

      <AppBreadcrumb />
      <div class="flex flex-col lg:flex-row lg:items-center justify-between mt-4 gap-4">
        <div class="flex items-center space-x-4">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Article</h1>
          <div class="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
            <button 
              @click="goToFirst" 
              :disabled="!canGoFirst" 
              class="p-1 hover:text-gray-700 dark:hover:text-white disabled:opacity-50" 
              title="Premier"
            >
              <ChevronsUp class="w-4 h-4" />
            </button>
            <button 
              @click="goToPrevious" 
              :disabled="!canGoPrevious" 
              class="p-1 hover:text-gray-700 dark:hover:text-white disabled:opacity-50" 
              title="Précédent"
            >
              <ChevronUp class="w-4 h-4" />
            </button>
            <button 
              @click="goToNext" 
              :disabled="!canGoNext" 
              class="p-1 hover:text-gray-700 dark:hover:text-white disabled:opacity-50" 
              title="Suivant"
            >
              <ChevronDown class="w-4 h-4" />
            </button>
            <button 
              @click="goToLast" 
              :disabled="!canGoLast" 
              class="p-1 hover:text-gray-700 dark:hover:text-white disabled:opacity-50" 
              title="Dernier"
            >
              <ChevronsDown class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Boutons contextuels à droite -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="btn in contextButtons"
            :key="btn.id"
            :class="`${btn.color} text-white text-sm px-3 py-1 rounded hover:opacity-80 flex items-center gap-1`"
            @click="console.log(`Clicked: ${btn.id}`)"
          >
            <span>{{ btn.icon }}</span>
            {{ btn.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Navigation par onglets -->
    <TabNavigation :tabs="tabs" :active-tab="activeTab" @tab-change="setActiveTab" />

    <!-- Contenu principal + barre de boutons verticale -->
    <div class="flex flex-1 overflow-y-auto min-h-0">
      <div class="flex-1 flex flex-col overflow-y-auto max-h-full">
        <!-- Affichage toolbar en mobile -->
        <div class="block lg:hidden">
          <VerticalToolbar :is-mobile="true" @action="handleActionClick" />
        </div>

        <!-- Formulaire article -->
        <div class="flex-1 overflow-y-auto">
          <ArticleForm
            :article="article"
            :active-tab="activeTab"
            @search-click="handleSearchClick"
          />
        </div>
      </div>

      <!-- Affichage toolbar en desktop (à droite) -->
      <div class="hidden lg:block">
        <VerticalToolbar @action="handleActionClick" />
      </div>
    </div>

    <!-- Modal recherche -->
    <SearchModal
      :is-open="showSearchModal"
      :articles="articles"
      @close="showSearchModal = false"
      @select="handleArticleSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import TabNavigation from './TabNavigation.vue'
import ArticleForm from './ArticleForm.vue'
import SearchModal from './SearchModal.vue'
import VerticalToolbar from './VerticalToolbar.vue'
import {
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from 'lucide-vue-next'

const props = defineProps({
  article: Object,
  articles: Array
})

const emit = defineEmits(['selectArticle', 'toggleMobileView'])

const activeTab = ref('identification')
const showSearchModal = ref(false)

const tabs = [
  { id: 'identification', label: 'Identification', active: true },
  { id: 'gestion', label: 'Gestion', active: false },
  { id: 'unites', label: 'Unités', active: false },
  { id: 'compta', label: 'Compta générale', active: false },
  { id: 'vente', label: 'Vente', active: false },
  { id: 'apres-vente', label: 'Après-vente', active: false },
  { id: 'clients', label: 'Clients', active: false },
  { id: 'achats', label: 'Achats', active: false },
  { id: 'fournisseurs', label: 'Fournisseurs', active: false },
]

const contextButtons = [
  { id: 'article-site', label: 'Article-site', color: 'bg-sage-blue-700', icon: '📄' },
  { id: 'tarifs-vente', label: 'Tarifs vente', color: 'bg-sage-blue-600', icon: '📊' },
  { id: 'tarifs-achat', label: 'Tarifs achat', color: 'bg-sage-blue-700', icon: '🛒' },
]

const currentIndex = computed(() => props.articles.findIndex(a => a.id === props.article.id))
const canGoFirst = computed(() => currentIndex.value > 0)
const canGoPrevious = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < props.articles.length - 1)
const canGoLast = computed(() => currentIndex.value < props.articles.length - 1)

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const handleSearchClick = () => {
  showSearchModal.value = true
}

const handleActionClick = (action) => {
  console.log(`Action triggered: ${action}`)
}

const handleArticleSelect = (article) => {
  emit('selectArticle', article)
  showSearchModal.value = false
}

const goToFirst = () => {
  if (canGoFirst.value) emit('selectArticle', props.articles[0])
}

const goToPrevious = () => {
  if (canGoPrevious.value) emit('selectArticle', props.articles[currentIndex.value - 1])
}

const goToNext = () => {
  if (canGoNext.value) emit('selectArticle', props.articles[currentIndex.value + 1])
}

const goToLast = () => {
  if (canGoLast.value) emit('selectArticle', props.articles[props.articles.length - 1])
}
</script>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import TabNavigation from './TabNavigation.vue'
import ArticleForm from './ArticleForm.vue'
import SearchModal from './SearchModal.vue'
import VerticalToolbar from './VerticalToolbar.vue'
import {
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
} from 'lucide-vue-next'

const props = defineProps({
  article: Object,
  articles: Array
})

const emit = defineEmits(['selectArticle', 'toggleMobileView'])

const activeTab = ref('identification')
const showSearchModal = ref(false)

const tabs = [
  { id: 'identification', label: 'Identification', active: true },
  { id: 'gestion', label: 'Gestion', active: false },
  { id: 'unites', label: 'Unités', active: false },
  { id: 'compta', label: 'Compta générale', active: false },
  { id: 'vente', label: 'Vente', active: false },
  { id: 'apres-vente', label: 'Après-vente', active: false },
  { id: 'clients', label: 'Clients', active: false },
  { id: 'achats', label: 'Achats', active: false },
  { id: 'fournisseurs', label: 'Fournisseurs', active: false },
]

const contextButtons = [
  { id: 'article-site', label: 'Article-site', color: 'bg-sage-blue-700', icon: '📄' },
  { id: 'tarifs-vente', label: 'Tarifs vente', color: 'bg-sage-blue-600', icon: '📊' },
  { id: 'tarifs-achat', label: 'Tarifs achat', color: 'bg-sage-blue-700', icon: '🛒' },
]

const currentIndex = computed(() => props.articles.findIndex(a => a.id === props.article.id))
const canGoFirst = computed(() => currentIndex.value > 0)
const canGoPrevious = computed(() => currentIndex.value > 0)
const canGoNext = computed(() => currentIndex.value < props.articles.length - 1)
const canGoLast = computed(() => currentIndex.value < props.articles.length - 1)

const setActiveTab = (tabId) => {
  activeTab.value = tabId
}

const handleSearchClick = () => {
  showSearchModal.value = true
}

const handleActionClick = (action) => {
  console.log(`Action triggered: ${action}`)
}

const handleArticleSelect = (article) => {
  emit('selectArticle', article)
  showSearchModal.value = false
}

const goToFirst = () => {
  if (canGoFirst.value) emit('selectArticle', props.articles[0])
}

const goToPrevious = () => {
  if (canGoPrevious.value) emit('selectArticle', props.articles[currentIndex.value - 1])
}

const goToNext = () => {
  if (canGoNext.value) emit('selectArticle', props.articles[currentIndex.value + 1])
}

const goToLast = () => {
  if (canGoLast.value) emit('selectArticle', props.articles[props.articles.length - 1])
}
</script>