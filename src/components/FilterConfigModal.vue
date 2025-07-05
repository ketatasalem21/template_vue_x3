<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full max-h-screen rounded-none
        sm:rounded-lg sm:max-w-2xl sm:max-h-[80vh] sm:w-auto sm:h-auto"
    >
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Configuration des filtres</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-3 sm:p-4 overflow-y-auto h-[calc(100vh-120px)] sm:h-auto">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Sélectionnez les champs que vous souhaitez utiliser comme filtres.
        </p>
        
        <div class="space-y-3 max-h-64 sm:max-h-96 overflow-y-auto">
          <div
            v-for="field in availableFields"
            :key="field.id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div class="flex items-center space-x-3 flex-1 min-w-0">
              <input
                type="checkbox"
                :checked="isFieldActive(field.id)"
                @change="toggleField(field)"
                class="w-4 h-4 text-sage-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-sage-blue-500"
              />
              <div class="min-w-0 flex-1">
                <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{{ field.label }}</div>
                <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Type: {{ getTypeLabel(field.type) }}
                </div>
              </div>
            </div>
            <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-2">
              {{ field.operators?.length || 1 }} opérateur{{ (field.operators?.length || 1) > 1 ? 's' : '' }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <button
          @click="$emit('close')"
          class="w-full sm:w-auto px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="saveConfig"
          class="w-full sm:w-auto px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  availableFields: Array,
  activeFields: Array
})

const emit = defineEmits(['close', 'update'])

const localActiveFields = ref([...props.activeFields])

const isFieldActive = (fieldId) => {
  return localActiveFields.value.some(field => field.id === fieldId)
}

const toggleField = (field) => {
  const index = localActiveFields.value.findIndex(f => f.id === field.id)
  if (index > -1) {
    localActiveFields.value.splice(index, 1)
  } else {
    localActiveFields.value.push({ ...field, operator: field.operators?.[0] || 'equals' })
  }
}

const getTypeLabel = (type) => {
  const labels = {
    text: 'Texte',
    number: 'Nombre',
    date: 'Date',
    select: 'Liste',
    search: 'Recherche'
  }
  return labels[type] || type
}

const saveConfig = () => {
  emit('update', localActiveFields.value)
  emit('close')
}
</script>