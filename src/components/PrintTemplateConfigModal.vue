<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Configuration du modèle d'impression</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="space-y-6">
          <!-- Template Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Modèle de document
            </label>
            <select
              v-model="selectedTemplate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner un modèle</option>
              <option value="invoice">Facture</option>
              <option value="quote">Devis</option>
              <option value="delivery">Bon de livraison</option>
              <option value="receipt">Reçu</option>
            </select>
          </div>

          <!-- Paper Format -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Format de papier
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center">
                <input
                  v-model="paperFormat"
                  type="radio"
                  value="A4"
                  class="mr-2"
                />
                A4 (210 × 297 mm)
              </label>
              <label class="flex items-center">
                <input
                  v-model="paperFormat"
                  type="radio"
                  value="Letter"
                  class="mr-2"
                />
                Letter (8.5 × 11 in)
              </label>
            </div>
          </div>

          <!-- Orientation -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Orientation
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center">
                <input
                  v-model="orientation"
                  type="radio"
                  value="portrait"
                  class="mr-2"
                />
                Portrait
              </label>
              <label class="flex items-center">
                <input
                  v-model="orientation"
                  type="radio"
                  value="landscape"
                  class="mr-2"
                />
                Paysage
              </label>
            </div>
          </div>

          <!-- Margins -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Marges (mm)
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Haut</label>
                <input
                  v-model.number="margins.top"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Bas</label>
                <input
                  v-model.number="margins.bottom"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Gauche</label>
                <input
                  v-model.number="margins.left"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Droite</label>
                <input
                  v-model.number="margins.right"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Header/Footer Options -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Options d'en-tête et pied de page
            </label>
            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="includeHeader"
                  type="checkbox"
                  class="mr-2"
                />
                Inclure l'en-tête
              </label>
              <label class="flex items-center">
                <input
                  v-model="includeFooter"
                  type="checkbox"
                  class="mr-2"
                />
                Inclure le pied de page
              </label>
              <label class="flex items-center">
                <input
                  v-model="includeLogo"
                  type="checkbox"
                  class="mr-2"
                />
                Inclure le logo
              </label>
            </div>
          </div>

          <!-- Font Settings -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Police et taille
            </label>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs text-gray-600 mb-1">Police</label>
                <select
                  v-model="fontFamily"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Calibri">Calibri</option>
                </select>
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1">Taille (pt)</label>
                <input
                  v-model.number="fontSize"
                  type="number"
                  min="8"
                  max="72"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          @click="saveConfiguration"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Enregistrer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  initialConfig: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

// Template configuration
const selectedTemplate = ref(props.initialConfig.template || '')
const paperFormat = ref(props.initialConfig.paperFormat || 'A4')
const orientation = ref(props.initialConfig.orientation || 'portrait')
const margins = ref({
  top: props.initialConfig.margins?.top || 20,
  bottom: props.initialConfig.margins?.bottom || 20,
  left: props.initialConfig.margins?.left || 20,
  right: props.initialConfig.margins?.right || 20
})

// Header/Footer options
const includeHeader = ref(props.initialConfig.includeHeader ?? true)
const includeFooter = ref(props.initialConfig.includeFooter ?? true)
const includeLogo = ref(props.initialConfig.includeLogo ?? true)

// Font settings
const fontFamily = ref(props.initialConfig.fontFamily || 'Arial')
const fontSize = ref(props.initialConfig.fontSize || 12)

// Watch for prop changes
watch(() => props.initialConfig, (newConfig) => {
  if (newConfig) {
    selectedTemplate.value = newConfig.template || ''
    paperFormat.value = newConfig.paperFormat || 'A4'
    orientation.value = newConfig.orientation || 'portrait'
    margins.value = {
      top: newConfig.margins?.top || 20,
      bottom: newConfig.margins?.bottom || 20,
      left: newConfig.margins?.left || 20,
      right: newConfig.margins?.right || 20
    }
    includeHeader.value = newConfig.includeHeader ?? true
    includeFooter.value = newConfig.includeFooter ?? true
    includeLogo.value = newConfig.includeLogo ?? true
    fontFamily.value = newConfig.fontFamily || 'Arial'
    fontSize.value = newConfig.fontSize || 12
  }
}, { deep: true })

const saveConfiguration = () => {
  const config = {
    template: selectedTemplate.value,
    paperFormat: paperFormat.value,
    orientation: orientation.value,
    margins: margins.value,
    includeHeader: includeHeader.value,
    includeFooter: includeFooter.value,
    includeLogo: includeLogo.value,
    fontFamily: fontFamily.value,
    fontSize: fontSize.value
  }
  
  emit('save', config)
  emit('close')
}
</script>

<style scoped>
/* Custom styles for the modal */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
</style>
</template>