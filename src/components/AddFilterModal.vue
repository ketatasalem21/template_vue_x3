<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Ajouter un filtre</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4">
        <div class="space-y-3 max-h-64 overflow-y-auto">
          <button
            v-for="field in availableFieldsToAdd"
            :key="field.id"
            @click="addField(field)"
            class="w-full text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <div class="font-medium text-gray-900 dark:text-white">{{ field.label }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Type: {{ getTypeLabel(field.type) }}
            </div>
          </button>
        </div>
        
        <div v-if="availableFieldsToAdd.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
          Tous les filtres disponibles sont déjà actifs
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  availableFields: Array,
  activeFields: Array
})

const emit = defineEmits(['close', 'add'])

const availableFieldsToAdd = computed(() => {
  return props.availableFields.filter(field => 
    !props.activeFields.some(active => active.id === field.id)
  )
})

const addField = (field) => {
  emit('add', field)
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
</script>