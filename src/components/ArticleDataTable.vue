<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-800">
    <!-- Header -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Articles</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ articles.length }} article(s)
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button class="px-3 py-2 text-sm bg-sage-blue-700 text-white rounded hover:bg-sage-blue-800 transition-colors">
            <Plus class="w-4 h-4 inline mr-1" />
            Nouvel article
          </button>
          <button class="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
            <RefreshCw class="w-4 h-4 inline mr-1" />
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher un article..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
          />
        </div>
        
        <select
          v-model="categoryFilter"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
        >
          <option value="">Toutes les catégories</option>
          <option value="FAB">FAB</option>
          <option value="FAV">FAV</option>
          <option value="FPV">FPV</option>
          <option value="ACH">ACH</option>
        </select>

        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="Acheté">Acheté</option>
          <option value="Non utilisable">Non utilisable</option>
          <option value="Fabriqué">Fabriqué</option>
        </select>
      </div>
    </div>

    <!-- Data Table -->
    <div class="flex-1 overflow-hidden">
      <div class="h-full overflow-y-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Code
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Désignation
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Statut
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date création
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="article in filteredArticles"
              :key="article.id"
              @click="selectArticle(article)"
              :class="`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                selectedArticle?.id === article.id
                  ? 'bg-sage-blue-50 dark:bg-sage-blue-900/20 border-l-4 border-sage-blue-500'
                  : ''
              }`"
            >
              <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                {{ article.id }}
              </td>
              <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                <div class="max-w-xs truncate">{{ article.designation }}</div>
              </td>
              <td class="px-4 py-3">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryStyle(article.category)}`">
                  {{ article.category }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(article.status)}`">
                  {{ article.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(article.createdAt) }}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="text-center py-12">
          <Package class="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Aucun article trouvé</h3>
          <p class="text-gray-500 dark:text-gray-400">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Search, Plus, RefreshCw, Package } from 'lucide-vue-next'

const props = defineProps({
  articles: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedArticle: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-article'])

const searchTerm = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

const filteredArticles = computed(() => {
  let filtered = [...props.articles]

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(article =>
      article.id.toLowerCase().includes(search) ||
      article.designation.toLowerCase().includes(search)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(article => article.category === categoryFilter.value)
  }

  if (statusFilter.value) {
    filtered = filtered.filter(article => article.status === statusFilter.value)
  }

  return filtered
})

const selectArticle = (article) => {
  emit('select-article', article)
}

const getCategoryStyle = (category) => {
  const styles = {
    'FAB': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'FAV': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'FPV': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'ACH': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
  }
  return styles[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const getStatusStyle = (status) => {
  const styles = {
    'Acheté': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Non utilisable': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Fabriqué': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>