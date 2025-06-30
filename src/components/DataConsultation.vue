<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Consultation des Données</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ filteredData.length }} résultat(s) sur {{ totalRecords }} enregistrement(s)
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="showFilterConfig = true"
            class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings class="w-4 h-4 inline mr-1" />
            Configurer filtres
          </button>
          <button
            @click="showColumnConfig = true"
            class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Columns class="w-4 h-4 inline mr-1" />
            Colonnes
          </button>
          <button
            @click="showExportConfig = true"
            class="px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Download class="w-4 h-4 inline mr-1" />
            Exporter
          </button>
          <button
            @click="refreshData"
            class="px-3 py-2 text-sm bg-sage-blue-700 text-white rounded hover:bg-sage-blue-800 transition-colors"
          >
            <RefreshCw class="w-4 h-4 inline mr-1" />
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Filters Panel -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-[88px] z-30">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <Filter class="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">Filtres Avancés</h3>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              ({{ activeFiltersCount }} actif{{ activeFiltersCount > 1 ? 's' : '' }})
            </span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="clearAllFilters"
              class="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
            >
              Effacer tout
            </button>
            <button
              @click="toggleFiltersPanel"
              class="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            >
              <ChevronDown v-if="showFilters" class="w-4 h-4" />
              <ChevronRight v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div v-show="showFilters" class="space-y-4">
          <!-- Quick Search -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recherche globale
              </label>
              <div class="relative">
                <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  v-model="globalSearch"
                  type="text"
                  placeholder="Rechercher dans tous les champs..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                />
                <button
                  v-if="globalSearch"
                  @click="globalSearch = ''"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Période
              </label>
              <select
                v-model="dateRangeFilter"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
              >
                <option value="">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="quarter">Ce trimestre</option>
                <option value="year">Cette année</option>
                <option value="custom">Période personnalisée</option>
              </select>
            </div>
          </div>

          <!-- Dynamic Filters -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterField
              v-for="filter in activeFilterFields"
              :key="filter.id"
              :filter="filter"
              :value="filters[filter.id]"
              @update="updateFilter"
              @remove="removeFilter"
            />
          </div>

          <!-- Add Filter Button -->
          <div class="flex items-center space-x-2">
            <button
              @click="showAddFilter = true"
              class="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus class="w-4 h-4 inline mr-1" />
              Ajouter un filtre
            </button>
            <button
              v-if="hasUnsavedFilters"
              @click="saveFilterPreset"
              class="px-3 py-2 text-sm bg-sage-blue-700 text-white rounded hover:bg-sage-blue-800 transition-colors"
            >
              <Save class="w-4 h-4 inline mr-1" />
              Sauvegarder preset
            </button>
          </div>

          <!-- Filter Presets -->
          <div v-if="filterPresets.length > 0" class="flex items-center space-x-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">Presets:</span>
            <button
              v-for="preset in filterPresets"
              :key="preset.id"
              @click="loadFilterPreset(preset)"
              class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white dark:bg-gray-800">
      <DataTable
        :data="paginatedData"
        :columns="visibleColumns"
        :loading="loading"
        :sort-column="sortColumn"
        :sort-direction="sortDirection"
        :selected-rows="selectedRows"
        :column-filters="columnFilters"
        @sort="handleSort"
        @select="handleRowSelect"
        @select-all="handleSelectAll"
        @row-click="handleRowClick"
        @column-filter="handleColumnFilter"
      />
    </div>

    <!-- Pagination -->
    <div class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3 sticky bottom-0 z-30">
      <DataPagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        :total-records="filteredData.length"
        :page-size-options="[10, 25, 50, 100]"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- Modals -->
    <FilterConfigModal
      :is-open="showFilterConfig"
      :available-fields="availableFilterFields"
      :active-fields="activeFilterFields"
      @close="showFilterConfig = false"
      @update="updateFilterConfig"
    />

    <ColumnConfigModal
      :is-open="showColumnConfig"
      :columns="tableColumns"
      @close="showColumnConfig = false"
      @update="updateColumnConfig"
    />

    <ExportConfigModal
      :is-open="showExportConfig"
      :columns="visibleColumns"
      :data="filteredData"
      @close="showExportConfig = false"
      @export="handleExport"
    />

    <AddFilterModal
      :is-open="showAddFilter"
      :available-fields="availableFilterFields"
      :active-fields="activeFilterFields"
      @close="showAddFilter = false"
      @add="addFilter"
    />

    <RowDetailModal
      :is-open="showRowDetail"
      :row-data="selectedRowData"
      @close="showRowDetail = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Filter, Search, Settings, Download, RefreshCw, ChevronDown, ChevronRight,
  X, Plus, Save, Columns
} from 'lucide-vue-next'
import FilterField from './FilterField.vue'
import DataTable from './DataTable.vue'
import DataPagination from './DataPagination.vue'
import FilterConfigModal from './FilterConfigModal.vue'
import ColumnConfigModal from './ColumnConfigModal.vue'
import ExportConfigModal from './ExportConfigModal.vue'
import AddFilterModal from './AddFilterModal.vue'
import RowDetailModal from './RowDetailModal.vue'

// État du composant
const loading = ref(false)
const showFilters = ref(true)
const showFilterConfig = ref(false)
const showColumnConfig = ref(false)
const showExportConfig = ref(false)
const showAddFilter = ref(false)
const showRowDetail = ref(false)
const selectedRowData = ref(null)

// Filtres
const globalSearch = ref('')
const dateRangeFilter = ref('')
const filters = ref({})
const columnFilters = ref({})
const hasUnsavedFilters = ref(false)

// Pagination et tri
const currentPage = ref(1)
const pageSize = ref(25)
const sortColumn = ref('')
const sortDirection = ref('asc')
const selectedRows = ref([])

// Configuration des colonnes
const tableColumns = ref([
  {
    id: 'id',
    label: 'ID',
    sortable: true,
    width: '80px',
    type: 'text',
    visible: true,
    searchable: true
  },
  {
    id: 'code',
    label: 'Code Article',
    sortable: true,
    width: '120px',
    type: 'text',
    visible: true,
    searchable: true
  },
  {
    id: 'designation',
    label: 'Désignation',
    sortable: true,
    width: '250px',
    type: 'text',
    visible: true,
    searchable: true
  },
  {
    id: 'category',
    label: 'Catégorie',
    sortable: true,
    width: '100px',
    type: 'badge',
    visible: true,
    searchable: true
  },
  {
    id: 'status',
    label: 'Statut',
    sortable: true,
    width: '100px',
    type: 'status',
    visible: true,
    searchable: true
  },
  {
    id: 'price',
    label: 'Prix',
    sortable: true,
    width: '100px',
    type: 'currency',
    visible: true,
    searchable: false
  },
  {
    id: 'stock',
    label: 'Stock',
    sortable: true,
    width: '80px',
    type: 'number',
    visible: true,
    searchable: false
  },
  {
    id: 'supplier',
    label: 'Fournisseur',
    sortable: true,
    width: '150px',
    type: 'text',
    visible: true,
    searchable: true
  },
  {
    id: 'createdAt',
    label: 'Date création',
    sortable: true,
    width: '120px',
    type: 'date',
    visible: true,
    searchable: false
  },
  {
    id: 'updatedAt',
    label: 'Dernière MAJ',
    sortable: true,
    width: '120px',
    type: 'date',
    visible: true,
    searchable: false
  }
])

// Champs de filtres disponibles
const availableFilterFields = ref([
  {
    id: 'code',
    label: 'Code Article',
    type: 'text',
    operators: ['contains', 'equals', 'starts_with', 'ends_with']
  },
  {
    id: 'designation',
    label: 'Désignation',
    type: 'text',
    operators: ['contains', 'equals', 'starts_with', 'ends_with']
  },
  {
    id: 'category',
    label: 'Catégorie',
    type: 'select',
    options: [
      { value: 'ACH', label: 'ACH' },
      { value: 'FAB', label: 'FAB' },
      { value: 'FAV', label: 'FAV' },
      { value: 'FPV', label: 'FPV' }
    ],
    operators: ['equals', 'not_equals', 'in']
  },
  {
    id: 'status',
    label: 'Statut',
    type: 'select',
    options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'draft', label: 'Brouillon' },
      { value: 'archived', label: 'Archivé' }
    ],
    operators: ['equals', 'not_equals', 'in']
  },
  {
    id: 'price',
    label: 'Prix',
    type: 'number',
    operators: ['equals', 'greater_than', 'less_than', 'between']
  },
  {
    id: 'stock',
    label: 'Stock',
    type: 'number',
    operators: ['equals', 'greater_than', 'less_than', 'between']
  },
  {
    id: 'supplier',
    label: 'Fournisseur',
    type: 'search',
    searchType: 'supplier',
    operators: ['equals', 'contains']
  },
  {
    id: 'createdAt',
    label: 'Date création',
    type: 'date',
    operators: ['equals', 'greater_than', 'less_than', 'between']
  },
  {
    id: 'updatedAt',
    label: 'Dernière MAJ',
    type: 'date',
    operators: ['equals', 'greater_than', 'less_than', 'between']
  }
])

// Champs de filtres actifs
const activeFilterFields = ref([
  {
    id: 'category',
    label: 'Catégorie',
    type: 'select',
    operator: 'equals',
    options: [
      { value: 'ACH', label: 'ACH' },
      { value: 'FAB', label: 'FAB' },
      { value: 'FAV', label: 'FAV' },
      { value: 'FPV', label: 'FPV' }
    ]
  },
  {
    id: 'status',
    label: 'Statut',
    type: 'select',
    operator: 'equals',
    options: [
      { value: 'active', label: 'Actif' },
      { value: 'inactive', label: 'Inactif' },
      { value: 'draft', label: 'Brouillon' },
      { value: 'archived', label: 'Archivé' }
    ]
  }
])

// Presets de filtres
const filterPresets = ref([
  {
    id: 'active_products',
    name: 'Produits actifs',
    filters: { status: 'active' }
  },
  {
    id: 'low_stock',
    name: 'Stock faible',
    filters: { stock: { operator: 'less_than', value: 10 } }
  }
])

// Données d'exemple étendues
const rawData = ref([
  {
    id: '1',
    code: 'B102000',
    designation: 'GANT PICOT NOIR "POLISSAGE"',
    category: 'ACH',
    status: 'active',
    price: 15.50,
    stock: 125,
    supplier: 'FOURNISSEUR A',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: '2',
    code: 'B102001',
    designation: 'MINI VANNE BS 1/2" MF NICKELEE',
    category: 'FAV',
    status: 'active',
    price: 28.75,
    stock: 45,
    supplier: 'FOURNISSEUR B',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: '3',
    code: 'B102002',
    designation: 'VANNE BS 1/2" MM PAPILLON ROUGE',
    category: 'FPV',
    status: 'inactive',
    price: 32.00,
    stock: 8,
    supplier: 'FOURNISSEUR C',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  },
  {
    id: '4',
    code: 'B102003',
    designation: 'RACCORD LAITON 1/2" MF',
    category: 'FAB',
    status: 'active',
    price: 12.25,
    stock: 200,
    supplier: 'FOURNISSEUR A',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-22'
  },
  {
    id: '5',
    code: 'B102004',
    designation: 'JOINT TORIQUE 15MM',
    category: 'ACH',
    status: 'draft',
    price: 2.50,
    stock: 500,
    supplier: 'FOURNISSEUR D',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-16'
  }
])

// Computed properties
const totalRecords = computed(() => rawData.value.length)

const visibleColumns = computed(() => {
  return tableColumns.value.filter(col => col.visible)
})

const filteredData = computed(() => {
  let data = [...rawData.value]

  // Recherche globale
  if (globalSearch.value) {
    const search = globalSearch.value.toLowerCase()
    data = data.filter(item =>
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(search)
      )
    )
  }

  // Filtres par colonne
  Object.entries(columnFilters.value).forEach(([columnId, filterValue]) => {
    if (filterValue && filterValue !== '') {
      const search = filterValue.toLowerCase()
      data = data.filter(item =>
        String(item[columnId]).toLowerCase().includes(search)
      )
    }
  })

  // Filtres spécifiques
  Object.entries(filters.value).forEach(([fieldId, filterValue]) => {
    if (filterValue && filterValue !== '') {
      const field = activeFilterFields.value.find(f => f.id === fieldId)
      if (field) {
        data = applyFieldFilter(data, fieldId, filterValue, field)
      }
    }
  })

  // Filtre de période
  if (dateRangeFilter.value) {
    data = applyDateRangeFilter(data, dateRangeFilter.value)
  }

  // Tri
  if (sortColumn.value) {
    data.sort((a, b) => {
      const aVal = a[sortColumn.value]
      const bVal = b[sortColumn.value]
      const modifier = sortDirection.value === 'desc' ? -1 : 1
      
      if (aVal < bVal) return -1 * modifier
      if (aVal > bVal) return 1 * modifier
      return 0
    })
  }

  return data
})

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (globalSearch.value) count++
  if (dateRangeFilter.value) count++
  count += Object.values(filters.value).filter(v => v && v !== '').length
  count += Object.values(columnFilters.value).filter(v => v && v !== '').length
  return count
})

// Méthodes
const toggleFiltersPanel = () => {
  showFilters.value = !showFilters.value
}

const updateFilter = ({ fieldId, value }) => {
  filters.value[fieldId] = value
  hasUnsavedFilters.value = true
  currentPage.value = 1
}

const handleColumnFilter = ({ columnId, value }) => {
  if (value === '') {
    delete columnFilters.value[columnId]
  } else {
    columnFilters.value[columnId] = value
  }
  currentPage.value = 1
}

const removeFilter = (fieldId) => {
  const index = activeFilterFields.value.findIndex(f => f.id === fieldId)
  if (index > -1) {
    activeFilterFields.value.splice(index, 1)
    delete filters.value[fieldId]
  }
}

const addFilter = (field) => {
  if (!activeFilterFields.value.find(f => f.id === field.id)) {
    activeFilterFields.value.push({ ...field, operator: field.operators[0] })
  }
  showAddFilter.value = false
}

const clearAllFilters = () => {
  globalSearch.value = ''
  dateRangeFilter.value = ''
  filters.value = {}
  columnFilters.value = {}
  hasUnsavedFilters.value = false
  currentPage.value = 1
}

const applyFieldFilter = (data, fieldId, filterValue, field) => {
  return data.filter(item => {
    const itemValue = item[fieldId]
    const operator = field.operator || 'equals'

    switch (operator) {
      case 'equals':
        return String(itemValue).toLowerCase() === String(filterValue).toLowerCase()
      case 'contains':
        return String(itemValue).toLowerCase().includes(String(filterValue).toLowerCase())
      case 'starts_with':
        return String(itemValue).toLowerCase().startsWith(String(filterValue).toLowerCase())
      case 'ends_with':
        return String(itemValue).toLowerCase().endsWith(String(filterValue).toLowerCase())
      case 'greater_than':
        return Number(itemValue) > Number(filterValue)
      case 'less_than':
        return Number(itemValue) < Number(filterValue)
      case 'not_equals':
        return String(itemValue).toLowerCase() !== String(filterValue).toLowerCase()
      default:
        return true
    }
  })
}

const applyDateRangeFilter = (data, range) => {
  const now = new Date()
  let startDate, endDate

  switch (range) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      break
    case 'week':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      endDate = now
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = now
      break
    case 'quarter':
      startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      endDate = now
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = now
      break
    default:
      return data
  }

  return data.filter(item => {
    const itemDate = new Date(item.updatedAt)
    return itemDate >= startDate && itemDate <= endDate
  })
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

const handleSelectAll = (selected) => {
  if (selected) {
    selectedRows.value = paginatedData.value.map(row => row.id)
  } else {
    selectedRows.value = []
  }
}

const handleRowClick = (row) => {
  selectedRowData.value = row
  showRowDetail.value = true
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handlePageSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const updateFilterConfig = (config) => {
  console.log('Filter config updated:', config)
}

const updateColumnConfig = (updatedColumns) => {
  tableColumns.value = updatedColumns
}

const handleExport = (exportConfig) => {
  console.log('Exporting with config:', exportConfig)
  // Logique d'export personnalisée
}

const saveFilterPreset = () => {
  const presetName = prompt('Nom du preset:')
  if (presetName) {
    filterPresets.value.push({
      id: Date.now().toString(),
      name: presetName,
      filters: { ...filters.value }
    })
    hasUnsavedFilters.value = false
  }
}

const loadFilterPreset = (preset) => {
  filters.value = { ...preset.filters }
  hasUnsavedFilters.value = false
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// Watchers
watch([globalSearch, dateRangeFilter], () => {
  currentPage.value = 1
})

onMounted(() => {
  // Initialisation
})
</script>