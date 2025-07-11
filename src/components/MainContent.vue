<template>
  <div class="flex-1 flex flex-col bg-white dark:bg-gray-900 h-full min-w-0">
    <!-- Header avec breadcrumb et boutons de navigation -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
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

        <!-- Contenu conditionnel selon la vue -->
        <div class="flex-1 overflow-y-auto">
          <!-- Vue Data (DataTable) -->
          <div v-if="props.currentView === 'data'" class="h-full">
            <DataTable
              :data="articles"
              :columns="tableColumns"
              :loading="false"
              :sort-column="sortColumn"
              :sort-direction="sortDirection"
              :selected-rows="selectedRows"
              :column-filters="columnFilters"
              @sort="handleSort"
              @select="handleRowSelect"
              @select-all="handleSelectAll"
              @row-click="handleArticleSelect"
              @column-filter="handleColumnFilter"
            />
          </div>

          <!-- Vue Form (ArticleForm) -->
          <div v-else>
            <ArticleForm
              :article="article"
              :active-tab="activeTab"
              @search-click="handleSearchClick"
            />
          </div>
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
import DataTable from './DataTable.vue'
import SearchModal from './SearchModal.vue'
import VerticalToolbar from './VerticalToolbar.vue'
import {
  ChevronsUp,
  ChevronsDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-vue-next'

const props = defineProps({
  article: Object,
  articles: Array,
  currentView: {
    type: String,
    default: 'data'
  }
})

const emit = defineEmits(['selectArticle'])

const activeTab = ref('identification')
const showSearchModal = ref(false)
const sortColumn = ref('')
const sortDirection = ref('asc')
const selectedRows = ref([])
const columnFilters = ref({})

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

const tableColumns = [
  { id: 'id', label: 'Code', type: 'text', width: '150px', sortable: true, searchable: true },
  { id: 'designation', label: 'Désignation', type: 'text', width: '300px', sortable: true, searchable: true },
  { id: 'category', label: 'Catégorie', type: 'text', width: '120px', sortable: true, searchable: true },
  { id: 'status', label: 'Statut', type: 'badge', width: '150px', sortable: true, searchable: true },
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

const handleSort = ({ column, direction }) => {
  sortColumn.value = column
  sortDirection.value = direction
}

const handleRowSelect = (rowId) => {
  const index = selectedRows.value.indexOf(rowId)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(rowId)
  }
}

const handleSelectAll = (checked) => {
  if (checked) {
    selectedRows.value = props.articles.map(article => article.id)
  } else {
    selectedRows.value = []
  }
}

const handleColumnFilter = ({ columnId, value }) => {
  columnFilters.value[columnId] = value
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