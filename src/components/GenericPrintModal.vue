<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full max-h-screen rounded-none
        sm:rounded-lg sm:max-w-6xl sm:max-h-[90vh] sm:w-auto sm:h-auto"
    >
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700" style="background: linear-gradient(to right, rgb(7, 58, 111), rgb(9, 70, 133));">
        <h2 class="text-base sm:text-lg font-semibold text-white">
          Impression {{ documentType?.name }} - {{ documentData?.number || 'N/A' }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors p-1"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-3 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto h-[calc(100vh-120px)] sm:h-auto">
        <!-- Sélection du modèle -->
        <div>
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white">Modèle d'impression</h3>
            <button
              @click="openTemplateManager"
              class="px-3 py-1 text-sm text-white rounded hover:opacity-80 transition-colors"
              style="background-color: rgb(7, 58, 111);"
            >
              <Settings class="w-4 h-4 inline mr-1" />
              Gérer les modèles
            </button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div
              v-for="template in availableTemplates"
              :key="template.id"
              @click="selectedTemplate = template.id"
              :class="`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ template.name }}</h4>
                <div v-if="template.isDefault" class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{{ template.description }}</p>
              <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Format: {{ template.format }}
              </div>
            </div>
          </div>
        </div>

        <!-- Options d'impression -->
        <div>
          <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-4">Options d'impression</h3>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de copies
                </label>
                <input
                  v-model="printOptions.copies"
                  type="number"
                  min="1"
                  max="10"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format de papier
                </label>
                <select
                  v-model="printOptions.paperSize"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                  <option value="Letter">Letter (216 x 279 mm)</option>
                  <option value="Legal">Legal (216 x 356 mm)</option>
                </select>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Orientation
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="printOptions.orientation"
                      type="radio"
                      value="portrait"
                      class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Portrait</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="printOptions.orientation"
                      type="radio"
                      value="landscape"
                      class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Paysage</span>
                  </label>
                </div>
              </div>
              
              <div class="space-y-3">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="printOptions.includeBackground"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Inclure les couleurs de fond</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    v-model="printOptions.showHeaders"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Afficher en-têtes et pieds de page</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Aperçu -->
        <div v-if="selectedTemplateData">
          <h3 class="text-sm sm:text-md font-medium text-gray-900 dark:text-white mb-4">Aperçu</h3>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 sm:p-4 max-h-64 sm:max-h-96 overflow-y-auto">
            <div class="bg-white rounded shadow-lg p-3 sm:p-6 max-w-full sm:max-w-2xl mx-auto transform scale-50 sm:scale-75 origin-top">
              <GenericDocumentPreview
                :template="selectedTemplateData"
                :document-type="documentType"
                :sample-data="documentData"
                mode="print"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 gap-3 sm:gap-0">
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          Modèle: {{ selectedTemplateData?.name }} • 
          {{ printOptions.copies }} copie(s) • 
          {{ printOptions.paperSize }} {{ printOptions.orientation }}
        </div>
        <div class="flex space-x-2 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="previewPrint"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <Eye class="w-4 h-4 inline mr-1" />
            Aperçu
          </button>
          <button
            @click="handlePrint"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-sm text-white rounded hover:opacity-80 transition-colors"
            style="background-color: rgb(7, 58, 111);"
          >
            <Printer class="w-4 h-4 inline mr-1" />
            Imprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Template Manager Modal -->
    <PrintTemplateManager
      :is-open="showTemplateManager"
      @close="showTemplateManager = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Settings, Star, Printer, Eye } from 'lucide-vue-next'
import GenericDocumentPreview from './GenericDocumentPreview.vue'
import PrintTemplateManager from './PrintTemplateManager.vue'

const props = defineProps({
  isOpen: Boolean,
  documentType: Object,
  documentData: Object,
  templates: Array
})

const emit = defineEmits(['close', 'print'])

const selectedTemplate = ref('')
const showTemplateManager = ref(false)
const printOptions = ref({
  copies: 1,
  paperSize: 'A4',
  orientation: 'portrait',
  includeBackground: true,
  showHeaders: true
})

const availableTemplates = computed(() => {
  return props.templates?.filter(template => 
    template.documentType === props.documentType?.id
  ) || []
})

const selectedTemplateData = computed(() => {
  return availableTemplates.value.find(t => t.id === selectedTemplate.value)
})

const openTemplateManager = () => {
  showTemplateManager.value = true
}

const handlePrint = () => {
  const printConfig = {
    template: selectedTemplateData.value,
    options: printOptions.value,
    document: props.documentData,
    documentType: props.documentType
  }
  emit('print', printConfig)
}

const previewPrint = () => {
  // Ouvrir l'aperçu avant impression dans une nouvelle fenêtre
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Aperçu - ${props.documentData?.number || 'Document'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .document-preview { max-width: 800px; margin: 0 auto; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <button onclick="window.print()">Imprimer</button>
            <button onclick="window.close()">Fermer</button>
          </div>
          <div class="document-preview">
            <!-- Contenu du document généré ici -->
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}

// Sélectionner le modèle par défaut à l'ouverture
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && availableTemplates.value.length > 0) {
    const defaultTemplate = availableTemplates.value.find(t => t.isDefault)
    selectedTemplate.value = defaultTemplate ? defaultTemplate.id : availableTemplates.value[0].id
  }
})
</script>