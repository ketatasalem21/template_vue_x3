<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Détails - {{ rowData?.code || 'N/A' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4 overflow-y-auto max-h-96" v-if="rowData">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(value, key) in rowData"
            :key="key"
            class="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              {{ getFieldLabel(key) }}
            </div>
            <div class="text-gray-900 dark:text-white">
              <TableCellDisplay :value="value" :type="getFieldType(key)" />
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Fermer
        </button>
        <button
          @click="editRecord"
          class="px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 transition-colors"
        >
          Modifier
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
import TableCellDisplay from './TableCellDisplay.vue'

const props = defineProps({
  isOpen: Boolean,
  rowData: Object
})

defineEmits(['close'])

const getFieldLabel = (key) => {
  const labels = {
    id: 'ID',
    code: 'Code Article',
    designation: 'Désignation',
    category: 'Catégorie',
    status: 'Statut',
    price: 'Prix',
    stock: 'Stock',
    supplier: 'Fournisseur',
    createdAt: 'Date création',
    updatedAt: 'Dernière MAJ'
  }
  return labels[key] || key
}

const getFieldType = (key) => {
  const types = {
    price: 'currency',
    stock: 'number',
    category: 'badge',
    status: 'status',
    createdAt: 'date',
    updatedAt: 'date'
  }
  return types[key] || 'text'
}

const editRecord = () => {
  console.log('Edit record:', props.rowData)
}
</script>