<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full m-0 rounded-none
        sm:rounded-lg sm:max-w-6xl sm:max-h-[90vh] sm:m-4"
    >
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-sage-blue-700">
        <div class="flex flex-col sm:flex-row sm:items-center sm:space-x-4 w-full">
          <h2 class="text-lg font-semibold text-white mb-2 sm:mb-0">Menu</h2>
          <div class="relative flex-1 mb-2 sm:mb-0">
            <Search class="w-4 h-4 text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search the navigation menu..."
              class="bg-white/10 text-white placeholder-gray-300 border border-white/20 pl-10 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-white/30 w-full sm:w-96"
            />
            <button
              v-if="searchTerm"
              @click="searchTerm = ''"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
          <div class="flex flex-row items-center space-x-2">
            <select 
              v-model="selectedResultIndex"
              class="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm"
              :disabled="filteredResults.length === 0"
            >
              <option v-if="filteredResults.length === 0" value="">0 of 0</option>
              <option 
                v-for="(result, index) in filteredResults" 
                :key="index" 
                :value="index"
              >
                {{ index + 1 }} of {{ filteredResults.length }}
              </option>
            </select>
            <button 
              @click="collapseAll"
              class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Collapse all
            </button>
            <button 
              @click="expandAll"
              class="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-colors"
            >
              Expand all
            </button>
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors absolute top-3 right-3 sm:static sm:ml-4"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex flex-col sm:flex-row h-[calc(100vh-64px)] sm:h-[calc(90vh-80px)]">
        <!-- Sidebar/Menu -->
        <div
          class="w-full flex flex-row overflow-x-auto whitespace-nowrap border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 sm:w-48 sm:flex-col sm:overflow-y-auto sm:border-b-0 sm:border-r"
        >
          <div class="flex flex-row sm:flex-col w-full">
            <NavigationCategory
              v-for="category in categories"
              :key="category.id"
              :category="category"
              :active="activeCategory === category.id"
              @select="setActiveCategory"
              class="min-w-[120px] sm:min-w-0"
            />
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-3 sm:p-6">
            <!-- Search Results -->
            <div v-if="searchTerm && filteredResults.length > 0" class="mb-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Résultats de recherche ({{ filteredResults.length }})
                </h3>
                <button
                  @click="clearSearch"
                  class="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                >
                  Effacer la recherche
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(result, index) in filteredResults"
                  :key="`search-${index}`"
                  @click="handleSearchResultClick(result)"
                  :class="`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedResultIndex === index
                      ? 'border-sage-blue-500 bg-sage-blue-50 dark:bg-sage-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-sage-blue-700 dark:text-sage-blue-400 text-sm">
                        {{ result.name }}
                      </div>
                      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {{ result.description }}
                      </div>
                      <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {{ result.category }} > {{ result.section }}
                      </div>
                    </div>
                    <ChevronRight class="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <!-- No Search Results -->
            <div v-else-if="searchTerm && filteredResults.length === 0" class="text-center py-12">
              <Search class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun résultat trouvé</h3>
              <p class="text-gray-500 dark:text-gray-400">
                Essayez avec d'autres mots-clés ou vérifiez l'orthographe
              </p>
            </div>

            <!-- Category Content -->
            <div v-else-if="activeCategory === 'setup'" class="space-y-6">
              <NavigationSection
                title="Users"
                :items="setupSections.users"
                :expanded="expandedSections.users"
                @toggle="toggleSection('users')"
                @item-click="handleNavigation"
              />
              
              <NavigationSection
                title="Destinations"
                :items="setupSections.destinations"
                :expanded="expandedSections.destinations"
                @toggle="toggleSection('destinations')"
                @item-click="handleNavigation"
              />

              <NavigationSection
                title="Workflow"
                :items="setupSections.workflow"
                :expanded="expandedSections.workflow"
                @toggle="toggleSection('workflow')"
                @item-click="handleNavigation"
              />

              <NavigationSection
                title="General parameters"
                :items="setupSections.generalParameters"
                :expanded="expandedSections.generalParameters"
                @toggle="toggleSection('generalParameters')"
                @item-click="handleNavigation"
              />
            </div>

            <div v-else-if="activeCategory === 'common-data'" class="space-y-6">
              <NavigationSection
                title="Articles"
                :items="commonDataSections.articles"
                :expanded="expandedSections.articles"
                @toggle="toggleSection('articles')"
                @item-click="handleNavigation"
              />
              
              <NavigationSection
                title="Clients"
                :items="commonDataSections.clients"
                :expanded="expandedSections.clients"
                @toggle="toggleSection('clients')"
                @item-click="handleNavigation"
              />

              <NavigationSection
                title="Fournisseurs"
                :items="commonDataSections.suppliers"
                :expanded="expandedSections.suppliers"
                @toggle="toggleSection('suppliers')"
                @item-click="handleNavigation"
              />

              <NavigationSection
                title="Factures"
                :items="commonDataSections.invoices"
                :expanded="expandedSections.invoices"
                @toggle="toggleSection('invoices')"
                @item-click="handleNavigation"
              />
            </div>

            <div v-else class="text-center py-12">
              <h3 class="text-xl text-gray-500 dark:text-gray-400">{{ getCategoryName(activeCategory) }}</h3>
              <p class="text-gray-400 dark:text-gray-500 mt-2">Contenu en développement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Search, X, ChevronRight } from 'lucide-vue-next'
import NavigationCategory from './NavigationCategory.vue'
import NavigationSection from './NavigationSection.vue'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'navigate'])

const searchTerm = ref('')
const activeCategory = ref('setup')
const selectedResultIndex = ref(0)

// État des sections (expanded/collapsed)
const expandedSections = ref({
  users: true,
  destinations: true,
  workflow: true,
  generalParameters: true,
  articles: true,
  clients: true,
  suppliers: true,
  invoices: true
})

const categories = [
  { id: 'administration', name: 'Administration', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'development', name: 'Development', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'setup', name: 'Setup', color: 'bg-green-100 border-green-300 text-green-700', active: true },
  { id: 'common-data', name: 'Common data', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'declarations', name: 'Declarations', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'usage', name: 'Usage', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'reports', name: 'Reports', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'translations', name: 'Translations', color: 'bg-red-100 border-red-300 text-red-700' }
]

// Données des sections Setup
const setupSections = {
  users: [
    { name: 'Function profile', description: 'Manage user function profiles', category: 'Setup', section: 'Users' },
    { name: 'Professional profile', description: 'Configure professional profiles', category: 'Setup', section: 'Users' },
    { name: 'Directory', description: 'User directory management', category: 'Setup', section: 'Users' },
    { name: 'Menu profile', description: 'Customize menu profiles', highlighted: true, category: 'Setup', section: 'Users' },
    { name: 'Row level permissions', description: 'Set row-level access permissions', category: 'Setup', section: 'Users' },
    { name: 'Functional authorization', description: 'Configure functional authorizations', category: 'Setup', section: 'Users' },
    { name: 'Access codes', description: 'Manage access codes', category: 'Setup', section: 'Users' }
  ],
  destinations: [
    { name: 'Destinations', description: 'Configure system destinations', category: 'Setup', section: 'Destinations' },
    { name: 'Destinations by user', description: 'User-specific destinations', category: 'Setup', section: 'Destinations' },
    { name: 'Archiving rules', description: 'Set up archiving rules', category: 'Setup', section: 'Destinations' },
    { name: 'Archiving parameters', description: 'Configure archiving parameters', category: 'Setup', section: 'Destinations' },
    { name: 'Print code', description: 'Manage print codes', category: 'Setup', section: 'Destinations' },
    { name: 'Default values', description: 'Set default system values', category: 'Setup', section: 'Destinations' }
  ],
  workflow: [
    { name: 'User rules of assignment', description: 'Configure user assignment rules', category: 'Setup', section: 'Workflow' },
    { name: 'User assignment', description: 'Manage user assignments', category: 'Setup', section: 'Workflow' },
    { name: 'User delegates', description: 'Set up user delegates', category: 'Setup', section: 'Workflow' },
    { name: 'Workflow rules', description: 'Define workflow rules', category: 'Setup', section: 'Workflow' },
    { name: 'Workbench parameters', description: 'Configure workbench settings', category: 'Setup', section: 'Workflow' },
    { name: 'Manual workflow', description: 'Manual workflow management', category: 'Setup', section: 'Workflow' },
    { name: 'Notifications', description: 'System notifications setup', category: 'Setup', section: 'Workflow' }
  ],
  generalParameters: [
    { name: 'Folders', description: 'Manage system folders', category: 'Setup', section: 'General parameters' },
    { name: 'Parameter values', description: 'Configure parameter values', category: 'Setup', section: 'General parameters' },
    { name: 'Sets of values', description: 'Manage value sets', category: 'Setup', section: 'General parameters' },
    { name: 'Control tables', description: 'System control tables', category: 'Setup', section: 'General parameters' },
    { name: 'Sequence number definition', description: 'Define sequence numbers', category: 'Setup', section: 'General parameters' },
    { name: 'Miscellaneous tables', description: 'Various system tables', category: 'Setup', section: 'General parameters' }
  ]
}

// Données des sections Common Data
const commonDataSections = {
  articles: [
    { name: 'Gestion des articles', description: 'Manage product catalog', action: 'articles', category: 'Common data', section: 'Articles' },
    { name: 'Consultation des données', description: 'Data consultation with advanced filters', action: 'consultation', category: 'Common data', section: 'Articles' },
    { name: 'Import/Export articles', description: 'Import and export articles', category: 'Common data', section: 'Articles' },
    { name: 'Catégories articles', description: 'Manage article categories', category: 'Common data', section: 'Articles' },
    { name: 'Familles articles', description: 'Manage article families', category: 'Common data', section: 'Articles' },
    { name: 'Unités de mesure', description: 'Manage measurement units', category: 'Common data', section: 'Articles' }
  ],
  clients: [
    { name: 'Gestion des clients', description: 'Customer management', category: 'Common data', section: 'Clients' },
    { name: 'Groupes clients', description: 'Customer groups', category: 'Common data', section: 'Clients' },
    { name: 'Tarifs clients', description: 'Customer pricing', category: 'Common data', section: 'Clients' },
    { name: 'Conditions de paiement', description: 'Payment terms', category: 'Common data', section: 'Clients' },
    { name: 'Adresses de livraison', description: 'Delivery addresses', category: 'Common data', section: 'Clients' }
  ],
  suppliers: [
    { name: 'Gestion des fournisseurs', description: 'Supplier management', category: 'Common data', section: 'Fournisseurs' },
    { name: 'Groupes fournisseurs', description: 'Supplier groups', category: 'Common data', section: 'Fournisseurs' },
    { name: 'Tarifs fournisseurs', description: 'Supplier pricing', category: 'Common data', section: 'Fournisseurs' },
    { name: 'Conditions d\'achat', description: 'Purchase conditions', category: 'Common data', section: 'Fournisseurs' }
  ],
  invoices: [
    { name: 'Gestion des factures', description: 'Invoice management with print templates', action: 'invoices', category: 'Common data', section: 'Factures' },
    { name: 'Modèles d\'impression', description: 'Configure print templates for invoices', category: 'Common data', section: 'Factures' },
    { name: 'Historique des impressions', description: 'Print history and logs', category: 'Common data', section: 'Factures' },
    { name: 'Paramètres de facturation', description: 'Invoice settings and configuration', category: 'Common data', section: 'Factures' }
  ]
}

// Computed pour tous les éléments de navigation
const allNavigationItems = computed(() => {
  const items = []
  
  // Ajouter les éléments de Setup
  Object.entries(setupSections).forEach(([sectionKey, sectionItems]) => {
    items.push(...sectionItems)
  })
  
  // Ajouter les éléments de Common Data
  Object.entries(commonDataSections).forEach(([sectionKey, sectionItems]) => {
    items.push(...sectionItems)
  })
  
  return items
})

// Computed pour les résultats de recherche filtrés
const filteredResults = computed(() => {
  if (!searchTerm.value) return []
  
  const search = searchTerm.value.toLowerCase()
  return allNavigationItems.value.filter(item =>
    item.name.toLowerCase().includes(search) ||
    item.description.toLowerCase().includes(search) ||
    item.category.toLowerCase().includes(search) ||
    item.section.toLowerCase().includes(search)
  )
})

// Méthodes
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
  searchTerm.value = '' // Clear search when changing category
}

const getCategoryName = (categoryId) => {
  const category = categories.find(c => c.id === categoryId)
  return category ? category.name : 'Section'
}

const toggleSection = (sectionKey) => {
  expandedSections.value[sectionKey] = !expandedSections.value[sectionKey]
}

const collapseAll = () => {
  Object.keys(expandedSections.value).forEach(key => {
    expandedSections.value[key] = false
  })
}

const expandAll = () => {
  Object.keys(expandedSections.value).forEach(key => {
    expandedSections.value[key] = true
  })
}

const clearSearch = () => {
  searchTerm.value = ''
  selectedResultIndex.value = 0
}

const handleSearchResultClick = (result) => {
  if (result.action) {
    emit('navigate', result.action)
  } else {
    console.log('Navigate to:', result.name)
  }
}

const handleNavigation = (item) => {
  if (item.action) {
    emit('navigate', item.action)
  } else {
    console.log('Navigate to:', item.name)
  }
}

// Watchers
watch(searchTerm, () => {
  selectedResultIndex.value = 0
})

watch(selectedResultIndex, (newIndex) => {
  if (filteredResults.value[newIndex]) {
    // Optionnel: scroll vers l'élément sélectionné
    console.log('Selected result:', filteredResults.value[newIndex])
  }
})
</script>