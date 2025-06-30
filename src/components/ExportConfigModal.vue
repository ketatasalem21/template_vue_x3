<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Configuration de l'export</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Format d'export -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Format d'export</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              v-for="format in exportFormats"
              :key="format.id"
              @click="selectedFormat = format.id"
              :class="`p-3 border-2 rounded-lg transition-colors ${
                selectedFormat === format.id
                  ? 'border-sage-blue-500 bg-sage-blue-50 dark:bg-sage-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`"
            >
              <div class="flex flex-col items-center space-y-2">
                <component :is="format.icon" class="w-6 h-6 text-gray-600 dark:text-gray-400" />
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ format.label }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ format.description }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Sélection des colonnes -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-md font-medium text-gray-900 dark:text-white">Colonnes à exporter</h3>
            <div class="flex items-center space-x-2">
              <button
                @click="selectAllColumns"
                class="text-sm text-sage-blue-600 dark:text-sage-blue-400 hover:text-sage-blue-800 dark:hover:text-sage-blue-300"
              >
                Tout sélectionner
              </button>
              <span class="text-gray-300 dark:text-gray-600">|</span>
              <button
                @click="deselectAllColumns"
                class="text-sm text-sage-blue-600 dark:text-sage-blue-400 hover:text-sage-blue-800 dark:hover:text-sage-blue-300"
              >
                Tout désélectionner
              </button>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <label
              v-for="column in columns"
              :key="column.id"
              class="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="selectedColumns.includes(column.id)"
                @change="toggleColumn(column.id)"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              <div class="flex-1">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ column.label }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ getTypeLabel(column.type) }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Options d'export -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Options d'export</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du fichier
              </label>
              <input
                v-model="fileName"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                placeholder="export_donnees"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Encodage
              </label>
              <select
                v-model="encoding"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
              >
                <option value="utf-8">UTF-8</option>
                <option value="iso-8859-1">ISO-8859-1</option>
                <option value="windows-1252">Windows-1252</option>
              </select>
            </div>
          </div>
          
          <div class="mt-4 space-y-3">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="includeHeaders"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Inclure les en-têtes de colonnes</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="includeFilters"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Inclure les informations de filtrage</span>
            </label>
            
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="formatDates"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Formater les dates (DD/MM/YYYY)</span>
            </label>
          </div>
        </div>

        <!-- Aperçu -->
        <div v-if="selectedColumns.length > 0">
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-3">Aperçu de l'export</h3>
          <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-32 overflow-auto">
            <div class="text-xs font-mono text-gray-600 dark:text-gray-300">
              <div v-if="includeHeaders" class="font-bold border-b border-gray-300 dark:border-gray-600 pb-1 mb-1">
                {{ previewHeaders }}
              </div>
              <div v-for="(row, index) in previewData" :key="index" class="py-0.5">
                {{ row }}
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {{ selectedColumns.length }} colonne(s) sélectionnée(s) • {{ data.length }} ligne(s) à exporter
          </p>
        </div>
      </div>
      
      <div class="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Format: {{ getFormatLabel(selectedFormat) }} • 
          {{ selectedColumns.length }}/{{ columns.length }} colonnes
        </div>
        <div class="flex space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="handleExport"
            :disabled="selectedColumns.length === 0"
            class="px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download class="w-4 h-4 inline mr-1" />
            Exporter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Download, FileText, Table, FileSpreadsheet, Code } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  columns: Array,
  data: Array
})

const emit = defineEmits(['close', 'export'])

// État du composant
const selectedFormat = ref('csv')
const selectedColumns = ref([])
const fileName = ref('export_donnees')
const encoding = ref('utf-8')
const includeHeaders = ref(true)
const includeFilters = ref(false)
const formatDates = ref(true)

// Formats d'export disponibles
const exportFormats = ref([
  {
    id: 'csv',
    label: 'CSV',
    description: 'Valeurs séparées par virgules',
    icon: FileText,
    extension: 'csv'
  },
  {
    id: 'excel',
    label: 'Excel',
    description: 'Classeur Microsoft Excel',
    icon: FileSpreadsheet,
    extension: 'xlsx'
  },
  {
    id: 'json',
    label: 'JSON',
    description: 'JavaScript Object Notation',
    icon: Code,
    extension: 'json'
  },
  {
    id: 'xml',
    label: 'XML',
    description: 'Extensible Markup Language',
    icon: Code,
    extension: 'xml'
  }
])

// Computed properties
const previewHeaders = computed(() => {
  return selectedColumns.value
    .map(colId => props.columns.find(col => col.id === colId)?.label)
    .join(' | ')
})

const previewData = computed(() => {
  return props.data.slice(0, 3).map(row => {
    return selectedColumns.value
      .map(colId => {
        let value = row[colId]
        if (formatDates.value && typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
          value = new Date(value).toLocaleDateString('fr-FR')
        }
        return value
      })
      .join(' | ')
  })
})

// Méthodes
const selectAllColumns = () => {
  selectedColumns.value = props.columns.map(col => col.id)
}

const deselectAllColumns = () => {
  selectedColumns.value = []
}

const toggleColumn = (columnId) => {
  const index = selectedColumns.value.indexOf(columnId)
  if (index > -1) {
    selectedColumns.value.splice(index, 1)
  } else {
    selectedColumns.value.push(columnId)
  }
}

const getTypeLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nombre',
    currency: 'Devise',
    date: 'Date',
    badge: 'Badge',
    status: 'Statut'
  }
  return labels[type] || type
}

const getFormatLabel = (formatId) => {
  const format = exportFormats.value.find(f => f.id === formatId)
  return format ? format.label : formatId
}

const handleExport = () => {
  const exportConfig = {
    format: selectedFormat.value,
    columns: selectedColumns.value,
    fileName: fileName.value,
    encoding: encoding.value,
    options: {
      includeHeaders: includeHeaders.value,
      includeFilters: includeFilters.value,
      formatDates: formatDates.value
    }
  }
  
  emit('export', exportConfig)
  emit('close')
}

// Watchers
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Sélectionner toutes les colonnes par défaut
    selectedColumns.value = props.columns.map(col => col.id)
    // Générer un nom de fichier avec timestamp
    const now = new Date()
    const timestamp = now.toISOString().slice(0, 19).replace(/[:-]/g, '').replace('T', '_')
    fileName.value = `export_donnees_${timestamp}`
  }
})
</script>