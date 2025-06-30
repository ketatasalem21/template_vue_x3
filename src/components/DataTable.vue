<template>
  <div class="bg-white dark:bg-gray-800 relative">
    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-75 flex items-center justify-center z-10">
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sage-blue-700"></div>
        <span class="text-gray-600 dark:text-gray-300">Chargement...</span>
      </div>
    </div>

    <!-- Table Container - No scroll here -->
    <div class="w-full">
      <table class="w-full">
        <!-- Header -->
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <!-- Select All Checkbox -->
            <th class="w-12 px-4 py-3 text-left">
              <input
                type="checkbox"
                :checked="isAllSelected"
                @change="handleSelectAll"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
            </th>

            <!-- Column Headers -->
            <th
              v-for="column in columns"
              :key="column.id"
              :style="{ width: column.width }"
              class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            >
              <div class="space-y-2">
                <!-- Header with sort -->
                <div class="flex items-center space-x-1">
                  <span>{{ column.label }}</span>
                  <button
                    v-if="column.sortable"
                    @click="handleSort(column.id)"
                    class="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    <ChevronUp
                      v-if="sortColumn === column.id && sortDirection === 'asc'"
                      class="w-4 h-4"
                    />
                    <ChevronDown
                      v-else-if="sortColumn === column.id && sortDirection === 'desc'"
                      class="w-4 h-4"
                    />
                    <ChevronsUpDown v-else class="w-4 h-4" />
                  </button>
                </div>
                
                <!-- Column Search -->
                <div v-if="column.searchable" class="relative">
                  <Search class="w-3 h-3 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <input
                    :value="columnFilters[column.id] || ''"
                    @input="handleColumnFilter(column.id, $event.target.value)"
                    type="text"
                    :placeholder="`Filtrer ${column.label.toLowerCase()}...`"
                    class="w-full pl-6 pr-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sage-blue-500"
                  />
                  <button
                    v-if="columnFilters[column.id]"
                    @click="handleColumnFilter(column.id, '')"
                    class="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </th>

            <!-- Actions Column -->
            <th class="w-20 px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="row in data"
            :key="row.id"
            @click="$emit('rowClick', row)"
            :class="`hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
              selectedRows.includes(row.id) ? 'bg-sage-blue-50 dark:bg-sage-blue-900/20' : ''
            }`"
          >
            <!-- Row Checkbox -->
            <td class="px-4 py-3">
              <input
                type="checkbox"
                :checked="selectedRows.includes(row.id)"
                @change="handleRowSelect(row.id)"
                @click.stop
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
            </td>

            <!-- Data Cells -->
            <td
              v-for="column in columns"
              :key="`${row.id}-${column.id}`"
              class="px-4 py-3 text-sm"
            >
              <TableCellDisplay
                :value="row[column.id]"
                :type="column.type"
                :row="row"
              />
            </td>

            <!-- Actions -->
            <td class="px-4 py-3 text-center">
              <div class="flex items-center justify-center space-x-1">
                <button
                  @click.stop="editRow(row)"
                  class="text-gray-400 hover:text-sage-blue-600 transition-colors"
                  title="Modifier"
                >
                  <Edit class="w-4 h-4" />
                </button>
                <button
                  @click.stop="deleteRow(row)"
                  class="text-gray-400 hover:text-red-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="data.length === 0 && !loading">
            <td :colspan="columns.length + 2" class="px-4 py-12 text-center text-gray-500 dark:text-gray-400">
              <div class="flex flex-col items-center space-y-2">
                <Database class="w-12 h-12 text-gray-300 dark:text-gray-600" />
                <p class="text-lg font-medium">Aucune donnée trouvée</p>
                <p class="text-sm">Essayez de modifier vos critères de recherche</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Edit, Trash2, Database, Search, X
} from 'lucide-vue-next'
import TableCellDisplay from './TableCellDisplay.vue'

const props = defineProps({
  data: Array,
  columns: Array,
  loading: Boolean,
  sortColumn: String,
  sortDirection: String,
  selectedRows: Array,
  columnFilters: Object
})

const emit = defineEmits(['sort', 'select', 'selectAll', 'rowClick', 'columnFilter'])

const isAllSelected = computed(() => {
  return props.data.length > 0 && props.selectedRows.length === props.data.length
})

const handleSort = (columnId) => {
  let direction = 'asc'
  if (props.sortColumn === columnId && props.sortDirection === 'asc') {
    direction = 'desc'
  }
  emit('sort', { column: columnId, direction })
}

const handleRowSelect = (rowId) => {
  emit('select', rowId)
}

const handleSelectAll = (event) => {
  emit('selectAll', event.target.checked)
}

const handleColumnFilter = (columnId, value) => {
  emit('columnFilter', { columnId, value })
}

const editRow = (row) => {
  console.log('Edit row:', row)
}

const deleteRow = (row) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
    console.log('Delete row:', row)
  }
}
</script>