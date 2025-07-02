<template>
  <div class="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col min-w-0">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
      <h2 class="text-gray-900 dark:text-white font-semibold mb-3">Articles</h2>
      <div class="relative">
        <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Rechercher..."
          class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 pl-10 pr-4 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="p-2">
        <div class="mb-2">
          <button
            @click="articlesExpanded = !articlesExpanded"
            class="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
          >
            <ChevronDown v-if="articlesExpanded" class="w-4 h-4 text-gray-400" />
            <ChevronRight v-else class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-300">Articles ({{ filteredArticles.length }})</span>
          </button>
          
          <div v-if="articlesExpanded" class="ml-4 space-y-1">
            <!-- Column Headers with Search -->
            <div class="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium p-2 border-b border-gray-200 dark:border-gray-600">
              <div class="space-y-1">
                <div>Article</div>
                <div class="relative">
                  <Search class="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <input
                    v-model="searchTerm"
                    type="text"
                    placeholder=""
                    class="w-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 pl-6 pr-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div class="space-y-1">
                <div>Désignation 1</div>
                <div class="relative">
                  <Search class="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <input
                    v-model="designationSearch"
                    type="text"
                    placeholder=""
                    class="w-full bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-500 pl-6 pr-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div
              v-for="article in paginatedArticles"
              :key="article.id"
              @click="$emit('selectArticle', article)"
              :class="`grid grid-cols-2 gap-2 p-2 rounded cursor-pointer text-xs hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                selectedArticle.id === article.id ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`"
            >
              <div class="text-gray-900 dark:text-white truncate font-mono">{{ article.id }}</div>
              <div class="text-gray-600 dark:text-gray-300 truncate">{{ article.designation }}</div>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="totalPages > 1" class="flex items-center justify-between p-2 border-t border-gray-200 dark:border-gray-600 mt-2">
              <div class="flex items-center space-x-1">
                <button
                  @click="goToFirstPage"
                  :disabled="currentPage === 1"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Premier"
                >
                  <ChevronsLeft class="w-3 h-3" />
                </button>
                <button
                  @click="goToPreviousPage"
                  :disabled="currentPage === 1"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Précédent"
                >
                  <ChevronLeft class="w-3 h-3" />
                </button>
              </div>
              
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ currentPage }} / {{ totalPages }}
              </span>
              
              <div class="flex items-center space-x-1">
                <button
                  @click="goToNextPage"
                  :disabled="currentPage === totalPages"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Suivant"
                >
                  <ChevronRight class="w-3 h-3" />
                </button>
                <button
                  @click="goToLastPage"
                  :disabled="currentPage === totalPages"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Dernier"
                >
                  <ChevronsRight class="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-2">
          <button
            @click="recentExpanded = !recentExpanded"
            class="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
          >
            <ChevronDown v-if="recentExpanded" class="w-4 h-4 text-gray-400" />
            <ChevronRight v-else class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-300">Derniers lus</span>
          </button>
        </div>

        <div class="mb-2">
          <button
            @click="explorerExpanded = !explorerExpanded"
            class="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm"
          >
            <ChevronDown v-if="explorerExpanded" class="w-4 h-4 text-gray-400" />
            <ChevronRight v-else class="w-4 h-4 text-gray-400" />
            <span class="text-gray-700 dark:text-gray-300">Explorateur de liaisons</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronDown, ChevronRight, Search, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const props = defineProps({
  articles: Array,
  selectedArticle: Object
})

defineEmits(['selectArticle'])

const searchTerm = ref('')
const designationSearch = ref('')
const articlesExpanded = ref(true)
const recentExpanded = ref(false)
const explorerExpanded = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10

const filteredArticles = computed(() => {
  return props.articles.filter(article =>
    (article.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    article.designation.toLowerCase().includes(searchTerm.value.toLowerCase())) &&
    article.designation.toLowerCase().includes(designationSearch.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage))

const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(startIndex, startIndex + itemsPerPage)
})

const goToFirstPage = () => { currentPage.value = 1 }
const goToPreviousPage = () => { currentPage.value = Math.max(1, currentPage.value - 1) }
const goToNextPage = () => { currentPage.value = Math.min(totalPages.value, currentPage.value + 1) }
const goToLastPage = () => { currentPage.value = totalPages.value }
</script>