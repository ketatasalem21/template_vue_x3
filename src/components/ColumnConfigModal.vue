<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Configuration des colonnes</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4 max-h-96 overflow-y-auto">
        <div class="space-y-3">
          <div
            v-for="(column, index) in localColumns"
            :key="column.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div class="flex items-center space-x-2">
                <button
                  @click="moveColumn(index, -1)"
                  :disabled="index === 0"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Monter"
                >
                  <ChevronUp class="w-4 h-4" />
                </button>
                <button
                  @click="moveColumn(index, 1)"
                  :disabled="index === localColumns.length - 1"
                  class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Descendre"
                >
                  <ChevronDown class="w-4 h-4" />
                </button>
              </div>
              
              <input
                type="checkbox"
                :checked="column.visible"
                @change="toggleColumn(column.id)"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {{ column.label }}
                  <span v-if="column.required" class="text-red-500 ml-1">*</span>
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Type: {{ getTypeLabel(column.type) }} | Largeur: {{ column.width }}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <input
                v-model="column.width"
                type="text"
                placeholder="120px"
                class="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                v-model="column.type"
                class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="text">Texte</option>
                <option value="number">Nombre</option>
                <option value="currency">Devise</option>
                <option value="date">Date</option>
                <option value="badge">Badge</option>
                <option value="status">Statut</option>
              </select>
              <label class="flex items-center space-x-1">
                <input
                  type="checkbox"
                  :checked="column.searchable"
                  @change="column.searchable = $event.target.checked"
                  class="w-3 h-3 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
                />
                <span class="text-xs text-gray-600 dark:text-gray-400">Recherche</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="saveConfig"
          class="px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X, ChevronUp, ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  columns: Array
})

const emit = defineEmits(['close', 'update'])

const localColumns = ref([])

watch(() => props.columns, (newColumns) => {
  if (newColumns) {
    localColumns.value = JSON.parse(JSON.stringify(newColumns))
  }
}, { immediate: true })

const toggleColumn = (columnId) => {
  const column = localColumns.value.find(col => col.id === columnId)
  if (column) {
    column.visible = !column.visible
  }
}

const moveColumn = (index, direction) => {
  const newIndex = index + direction
  if (newIndex >= 0 && newIndex < localColumns.value.length) {
    const temp = localColumns.value[index]
    localColumns.value[index] = localColumns.value[newIndex]
    localColumns.value[newIndex] = temp
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

const saveConfig = () => {
  emit('update', localColumns.value)
  emit('close')
}
</script>