<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
    <!-- Header avec titre et boutons -->
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ title }}</h3>
      <div class="flex items-center space-x-2">
        <button
          @click="showColumnConfig = true"
          class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Configurer les colonnes"
        >
          <Settings class="w-4 h-4 inline mr-1" />
          Colonnes
        </button>
        <button
          @click="addNewRow"
          class="px-3 py-1 text-sm bg-sage-blue-700 text-white rounded hover:bg-sage-blue-800 transition-colors"
        >
          <Plus class="w-4 h-4 inline mr-1" />
          Nouvelle ligne
        </button>
      </div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <!-- En-têtes -->
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="w-12 px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              #
            </th>
            <th
              v-for="column in visibleColumns"
              :key="column.id"
              class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              :style="{ minWidth: column.width || '120px' }"
            >
              {{ column.label }}
              <span v-if="column.required" class="text-red-500 ml-1">*</span>
            </th>
            <th class="w-16 px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <!-- Corps du tableau -->
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr
            v-for="(row, rowIndex) in tableData"
            :key="row.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <!-- Numéro de ligne -->
            <td class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              {{ rowIndex + 1 }}
            </td>

            <!-- Cellules éditables -->
            <td
              v-for="column in visibleColumns"
              :key="`${row.id}-${column.id}`"
              class="px-3 py-2"
            >
              <TableCell
                :value="row[column.id]"
                :column="column"
                :row-id="row.id"
                @update="updateCell"
                @search-click="openSearchModal"
              />
            </td>

            <!-- Actions -->
            <td class="px-3 py-2 text-center">
              <button
                @click="deleteRow(rowIndex)"
                class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Supprimer la ligne"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>

          <!-- Ligne vide si pas de données -->
          <tr v-if="tableData.length === 0">
            <td :colspan="visibleColumns.length + 2" class="px-3 py-8 text-center text-gray-500 dark:text-gray-400">
              Aucune donnée. Cliquez sur "Nouvelle ligne" pour commencer.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Configuration des colonnes -->
    <ColumnConfigModal
      :is-open="showColumnConfig"
      :columns="allColumns"
      @close="showColumnConfig = false"
      @update="updateColumnConfig"
    />

    <!-- Modal de recherche -->
    <SearchModal
      :is-open="showSearchModal"
      :search-type="currentSearchType"
      :articles="articles"
      @close="showSearchModal = false"
      @select="handleSearchSelect"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Settings, Trash2 } from 'lucide-vue-next'
import TableCell from './TableCell.vue'
import ColumnConfigModal from './ColumnConfigModal.vue'
import SearchModal from './SearchModal.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Tableau interactif'
  },
  articles: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dataChange'])

// État du composant
const showColumnConfig = ref(false)
const showSearchModal = ref(false)
const currentSearchType = ref('')
const currentRowId = ref('')
const currentColumnId = ref('')

// Configuration des colonnes disponibles
const allColumns = ref([
  {
    id: 'orderNo',
    label: 'N° Commande',
    type: 'text',
    visible: true,
    required: true,
    width: '140px'
  },
  {
    id: 'product',
    label: 'Produit',
    type: 'search',
    searchType: 'product',
    visible: true,
    required: true,
    width: '120px'
  },
  {
    id: 'description',
    label: 'Description',
    type: 'text',
    visible: true,
    required: false,
    width: '200px'
  },
  {
    id: 'periodStart',
    label: 'Début période',
    type: 'date',
    visible: true,
    required: true,
    width: '130px'
  },
  {
    id: 'periodEnd',
    label: 'Fin période',
    type: 'date',
    visible: true,
    required: true,
    width: '130px'
  },
  {
    id: 'invoiceDate',
    label: 'Date facturation',
    type: 'date',
    visible: true,
    required: false,
    width: '140px'
  },
  {
    id: 'quantity',
    label: 'Quantité',
    type: 'number',
    visible: true,
    required: true,
    width: '100px'
  },
  {
    id: 'unit',
    label: 'Unité',
    type: 'select',
    options: [
      { value: 'UNT', label: 'UNT' },
      { value: 'KG', label: 'KG' },
      { value: 'L', label: 'L' },
      { value: 'M', label: 'M' }
    ],
    visible: true,
    required: true,
    width: '80px'
  },
  {
    id: 'amount',
    label: 'Montant HT',
    type: 'currency',
    visible: true,
    required: true,
    width: '120px'
  },
  {
    id: 'status',
    label: 'Statut',
    type: 'select',
    options: [
      { value: 'draft', label: 'Brouillon' },
      { value: 'confirmed', label: 'Confirmé' },
      { value: 'invoiced', label: 'Facturé' },
      { value: 'cancelled', label: 'Annulé' }
    ],
    visible: false,
    required: false,
    width: '100px'
  },
  {
    id: 'supplier',
    label: 'Fournisseur',
    type: 'search',
    searchType: 'supplier',
    visible: false,
    required: false,
    width: '150px'
  }
])

// Données du tableau
const tableData = ref([
  {
    id: '1',
    orderNo: 'SONFR0110069',
    product: 'EXP007',
    description: 'RTC 40M Invoicing terms',
    periodStart: '11/04/21',
    periodEnd: '12/03/21',
    invoiceDate: '12/03/21',
    quantity: '0.300000',
    unit: 'UNT',
    amount: '54,000.00',
    status: 'confirmed'
  },
  {
    id: '2',
    orderNo: 'SONFR0110069',
    product: 'EXP007',
    description: 'RTC 40M Invoicing terms',
    periodStart: '12/04/21',
    periodEnd: '01/03/22',
    invoiceDate: '01/03/22',
    quantity: '0.400000',
    unit: 'UNT',
    amount: '72,000.00',
    status: 'invoiced'
  }
])

// Colonnes visibles
const visibleColumns = computed(() => {
  return allColumns.value.filter(col => col.visible)
})

// Méthodes
const addNewRow = () => {
  const newId = Date.now().toString()
  const newRow = { id: newId }
  
  // Initialiser avec des valeurs par défaut
  allColumns.value.forEach(column => {
    if (column.type === 'date') {
      newRow[column.id] = new Date().toLocaleDateString('fr-FR')
    } else if (column.type === 'number' || column.type === 'currency') {
      newRow[column.id] = '0'
    } else if (column.type === 'select' && column.options?.length > 0) {
      newRow[column.id] = column.options[0].value
    } else {
      newRow[column.id] = ''
    }
  })
  
  tableData.value.push(newRow)
  emitDataChange()
}

const deleteRow = (index) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
    tableData.value.splice(index, 1)
    emitDataChange()
  }
}

const updateCell = ({ rowId, columnId, value }) => {
  const row = tableData.value.find(r => r.id === rowId)
  if (row) {
    row[columnId] = value
    emitDataChange()
  }
}

const updateColumnConfig = (updatedColumns) => {
  allColumns.value = updatedColumns
}

const openSearchModal = ({ rowId, columnId, searchType }) => {
  currentRowId.value = rowId
  currentColumnId.value = columnId
  currentSearchType.value = searchType
  showSearchModal.value = true
}

const handleSearchSelect = (selectedItem) => {
  updateCell({
    rowId: currentRowId.value,
    columnId: currentColumnId.value,
    value: selectedItem.code || selectedItem.id
  })
  showSearchModal.value = false
}

const emitDataChange = () => {
  emit('dataChange', tableData.value)
}
</script>