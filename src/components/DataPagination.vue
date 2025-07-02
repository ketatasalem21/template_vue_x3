<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <!-- Info -->
    <div class="flex items-center space-x-4 text-sm text-gray-700 dark:text-gray-300">
      <div class="flex items-center space-x-2">
        <span>Afficher</span>
        <select
          :value="pageSize"
          @change="$emit('pageSizeChange', Number($event.target.value))"
          class="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option
            v-for="size in pageSizeOptions"
            :key="size"
            :value="size"
          >
            {{ size }}
          </option>
        </select>
        <span>éléments par page</span>
      </div>
      <div>
        {{ startRecord }}-{{ endRecord }} sur {{ totalRecords }} résultats
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex items-center space-x-2">
      <!-- First Page -->
      <button
        @click="$emit('pageChange', 1)"
        :disabled="currentPage === 1"
        class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Première page"
      >
        <ChevronsLeft class="w-4 h-4" />
      </button>

      <!-- Previous Page -->
      <button
        @click="$emit('pageChange', currentPage - 1)"
        :disabled="currentPage === 1"
        class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Page précédente"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Page Numbers -->
      <div class="flex items-center space-x-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="$emit('pageChange', page)"
          :class="`px-3 py-1 text-sm rounded transition-colors ${
            page === currentPage
              ? 'bg-sage-blue-700 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`"
        >
          {{ page }}
        </button>
      </div>

      <!-- Next Page -->
      <button
        @click="$emit('pageChange', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Page suivante"
      >
        <ChevronRight class="w-4 h-4" />
      </button>

      <!-- Last Page -->
      <button
        @click="$emit('pageChange', totalPages)"
        :disabled="currentPage === totalPages"
        class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Dernière page"
      >
        <ChevronsRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  pageSize: Number,
  totalRecords: Number,
  pageSizeOptions: Array
})

defineEmits(['pageChange', 'pageSizeChange'])

const startRecord = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1
})

const endRecord = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalRecords)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})
</script>