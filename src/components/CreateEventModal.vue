<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Créer un événement</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Titre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Titre de l'événement *
          </label>
          <input
            v-model="formData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            placeholder="Entrez le titre de l'événement"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            placeholder="Description de l'événement (optionnel)"
          ></textarea>
        </div>

        <!-- Date et heure -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de début *
            </label>
            <input
              v-model="formData.startDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heure de début *
            </label>
            <input
              v-model="formData.startTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date de fin *
            </label>
            <input
              v-model="formData.endDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Heure de fin *
            </label>
            <input
              v-model="formData.endTime"
              type="time"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            />
          </div>
        </div>

        <!-- Catégorie et priorité -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie *
            </label>
            <select
              v-model="formData.category"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            >
              <option value="">Sélectionner une catégorie</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priorité
            </label>
            <select
              v-model="formData.priority"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            >
              <option value="low">Faible</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
        </div>

        <!-- Lieu -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lieu
          </label>
          <input
            v-model="formData.location"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
            placeholder="Lieu de l'événement (optionnel)"
          />
        </div>

        <!-- Participants -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Participants
          </label>
          <div class="space-y-2">
            <div
              v-for="(attendee, index) in formData.attendees"
              :key="index"
              class="flex items-center space-x-2"
            >
              <input
                v-model="formData.attendees[index]"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                placeholder="Nom du participant"
              />
              <button
                type="button"
                @click="removeAttendee(index)"
                class="p-2 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
            <button
              type="button"
              @click="addAttendee"
              class="flex items-center space-x-2 text-sage-blue-600 dark:text-sage-blue-400 hover:text-sage-blue-800 dark:hover:text-sage-blue-300 transition-colors"
            >
              <Plus class="w-4 h-4" />
              <span>Ajouter un participant</span>
            </button>
          </div>
        </div>

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
            Créer l'événement
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  initialDate: Date,
  categories: Array
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  title: '',
  description: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '10:00',
  category: '',
  priority: 'medium',
  location: '',
  attendees: ['']
})

const addAttendee = () => {
  formData.value.attendees.push('')
}

const removeAttendee = (index) => {
  if (formData.value.attendees.length > 1) {
    formData.value.attendees.splice(index, 1)
  }
}

const handleSubmit = () => {
  // Validation
  if (!formData.value.title || !formData.value.startDate || !formData.value.category) {
    alert('Veuillez remplir tous les champs obligatoires')
    return
  }

  // Construire les dates complètes
  const startDateTime = `${formData.value.startDate}T${formData.value.startTime}:00`
  const endDateTime = `${formData.value.endDate}T${formData.value.endTime}:00`

  // Filtrer les participants vides
  const attendees = formData.value.attendees.filter(attendee => attendee.trim() !== '')

  const eventData = {
    title: formData.value.title,
    description: formData.value.description,
    startTime: startDateTime,
    endTime: endDateTime,
    category: formData.value.category,
    priority: formData.value.priority,
    location: formData.value.location,
    attendees: attendees
  }

  emit('save', eventData)
}

// Initialiser les dates avec la date sélectionnée
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.initialDate) {
    const date = props.initialDate.toISOString().split('T')[0]
    formData.value.startDate = date
    formData.value.endDate = date
  }
})

// Réinitialiser le formulaire à la fermeture
watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    formData.value = {
      title: '',
      description: '',
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '10:00',
      category: '',
      priority: 'medium',
      location: '',
      attendees: ['']
    }
  }
})
</script>