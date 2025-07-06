<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] m-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Options d'impression - {{ invoice?.number }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-6 space-y-6 max-h-[calc(80vh-200px)] overflow-y-auto">
        <!-- Sélection du modèle -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900 dark:text-white">Modèle d'impression</h3>
            <button
              @click="$emit('configureTemplate')"
              class="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            >
              <Settings class="w-4 h-4 inline mr-1" />
              Configurer
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="template in templates"
              :key="template.id"
              @click="selectedTemplate = template.id"
              :class="`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedTemplate === template.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white">{{ template.name }}</h4>
                <div v-if="template.isDefault" class="flex items-center">
                  <Star class="w-4 h-4 text-yellow-500" />
                </div>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ template.description }}</p>
              
              <!-- Aperçu miniature -->
              <div class="mt-3 bg-gray-100 dark:bg-gray-700 rounded p-2">
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  <div class="flex items-center space-x-2 mb-1">
                    <div v-if="template.fields.header.showLogo" class="w-2 h-2 bg-purple-400 rounded"></div>
                    <span v-if="template.fields.header.showCompanyInfo">Entreprise</span>
                  </div>
                  <div class="border-t border-gray-300 dark:border-gray-600 pt-1">
                    <div class="flex justify-between">
                      <span v-if="template.fields.items.showDescription">Description</span>
                      <span v-if="template.fields.items.showTotal">Total</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Options d'impression -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">Options d'impression</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Format de papier
                </label>
                <select
                  v-model="printOptions.paperSize"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="A4">A4 (210 x 297 mm)</option>
                  <option value="A3">A3 (297 x 420 mm)</option>
                  <option value="Letter">Letter (216 x 279 mm)</option>
                  <option value="Legal">Legal (216 x 356 mm)</option>
                </select>
              </div>
              
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
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Portrait</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="printOptions.orientation"
                      type="radio"
                      value="landscape"
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Paysage</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Qualité d'impression
                </label>
                <select
                  v-model="printOptions.quality"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="draft">Brouillon</option>
                  <option value="normal">Normal</option>
                  <option value="high">Haute qualité</option>
                </select>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Couleur
                </label>
                <div class="flex space-x-4">
                  <label class="flex items-center">
                    <input
                      v-model="printOptions.color"
                      type="radio"
                      value="color"
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Couleur</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="printOptions.color"
                      type="radio"
                      value="grayscale"
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-purple-500"
                    />
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Noir et blanc</span>
                  </label>
                </div>
              </div>
              
              <div class="space-y-3">
                <label class="flex items-center space-x-2">
                  <input
                    v-model="printOptions.includeBackground"
                    type="checkbox"
                    class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Inclure les couleurs de fond</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    v-model="printOptions.fitToPage"
                    type="checkbox"
                    class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Ajuster à la page</span>
                </label>
                
                <label class="flex items-center space-x-2">
                  <input
                    v-model="printOptions.showHeaders"
                    type="checkbox"
                    class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300">Afficher en-têtes et pieds de page</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Aperçu -->
        <div v-if="selectedTemplateData">
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">Aperçu</h3>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
            <div class="bg-white rounded shadow-lg p-6 max-w-2xl mx-auto transform scale-75 origin-top">
              <InvoicePreview
                :template="selectedTemplateData"
                :invoice="invoice"
                mode="print"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer avec boutons plus visibles -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-4 sm:gap-0">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          Modèle: {{ selectedTemplateData?.name }} • 
          {{ printOptions.copies }} copie(s) • 
          {{ printOptions.paperSize }} {{ printOptions.orientation }}
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            @click="$emit('close')"
            class="w-full sm:w-auto px-6 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            @click="previewPrint"
            class="w-full sm:w-auto px-6 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <Eye class="w-4 h-4 inline mr-2" />
            Aperçu
          </button>
          <button
            @click="handlePrint"
            class="w-full sm:w-auto px-8 py-3 text-base font-medium text-white rounded-lg hover:opacity-90 transition-colors shadow-lg"
            style="background-color: rgb(7, 58, 111);"
          >
            <Printer class="w-5 h-5 inline mr-2" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Settings, Star, Printer, Eye } from 'lucide-vue-next'
import InvoicePreview from './InvoicePreview.vue'

const props = defineProps({
  isOpen: Boolean,
  invoice: Object,
  templates: Array
})

const emit = defineEmits(['close', 'print', 'configureTemplate'])

const selectedTemplate = ref('')
const printOptions = ref({
  copies: 1,
  paperSize: 'A4',
  orientation: 'portrait',
  quality: 'normal',
  color: 'color',
  includeBackground: true,
  fitToPage: true,
  showHeaders: true
})

const selectedTemplateData = computed(() => {
  return props.templates.find(t => t.id === selectedTemplate.value)
})

const handlePrint = () => {
  const printConfig = {
    template: selectedTemplateData.value,
    options: printOptions.value,
    invoice: props.invoice
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
          <title>Aperçu - ${props.invoice.number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-preview { max-width: 800px; margin: 0 auto; }
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
          <div class="invoice-preview">
            <!-- Contenu de la facture généré ici -->
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
  }
}

// Sélectionner le modèle par défaut à l'ouverture
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.templates.length > 0) {
    const defaultTemplate = props.templates.find(t => t.isDefault)
    selectedTemplate.value = defaultTemplate ? defaultTemplate.id : props.templates[0].id
  }
})
</script>