<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Rechercher un article</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4">
        <div class="relative mb-4">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher par code ou désignation..."
            class="w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            ref="searchInput"
          />
        </div>
        
        <div class="max-h-96 overflow-y-auto">
          <div class="grid grid-cols-4 gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium p-2 border-b border-gray-200 dark:border-gray-700">
            <div>Code Article</div>
            <div>Désignation</div>
            <div>Catégorie</div>
            <div>Statut</div>
          </div>
          
          <div
            v-for="article in filteredArticles"
            :key="article.id"
            @click="handleSelect(article)"
            class="grid grid-cols-4 gap-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors text-sm"
          >
            <div class="text-blue-600 dark:text-blue-400 font-mono">{{ article.id }}</div>
            <div class="text-gray-900 dark:text-white truncate">{{ article.designation }}</div>
            <div class="text-gray-600 dark:text-gray-300">{{ article.category }}</div>
            <div class="text-gray-600 dark:text-gray-300">{{ article.status }}</div>
          </div>
          
          <div v-if="filteredArticles.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucun article trouvé
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  articles: Array
})

const emit = defineEmits(['close', 'select'])

const searchTerm = ref('')
const searchInput = ref()

const filteredArticles = computed(() => {
  if (!searchTerm.value) return props.articles
  
  return props.articles.filter(article =>
    article.id.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
    article.designation.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const handleSelect = (article) => {
  emit('select', article)
}

watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    searchTerm.value = ''
    await nextTick()
    searchInput.value?.focus()
  }
})
</script>