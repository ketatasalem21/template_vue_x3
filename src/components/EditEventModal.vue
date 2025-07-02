<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Modifier l'événement</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Contenu identique à CreateEventModal mais avec les données pré-remplies -->
        <!-- ... (même structure que CreateEventModal) ... -->
        
        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 transition-colors"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  event: Object,
  categories: Array
})

const emit = defineEmits(['close', 'save'])

const formData = ref({})

const handleSubmit = () => {
  // Logique de sauvegarde similaire à CreateEventModal
  emit('save', { ...props.event, ...formData.value })
}

// Pré-remplir le formulaire avec les données de l'événement
watch(() => props.event, (event) => {
  if (event) {
    const startDate = new Date(event.startTime)
    const endDate = new Date(event.endTime)
    
    formData.value = {
      title: event.title,
      description: event.description,
      startDate: startDate.toISOString().split('T')[0],
      startTime: startDate.toTimeString().slice(0, 5),
      endDate: endDate.toISOString().split('T')[0],
      endTime: endDate.toTimeString().slice(0, 5),
      category: event.category,
      priority: event.priority,
      location: event.location,
      attendees: [...event.attendees]
    }
  }
}, { immediate: true })
</script>