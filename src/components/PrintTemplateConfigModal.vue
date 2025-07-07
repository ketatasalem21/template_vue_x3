<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden w-full h-full m-0 rounded-none sm:rounded-lg sm:max-w-[95vw] sm:max-h-[95vh] sm:m-4">
      <!-- Header avec couleur bleue -->
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700" style="background: linear-gradient(to right, rgb(7, 58, 111), rgb(9, 70, 133));">
        <div class="flex items-center space-x-3">
          <Settings class="w-6 h-6 text-white" />
          <h2 class="text-lg font-semibold text-white">Gestionnaire de Modèles d'Impression</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Contenu principal en colonnes -->
      <div class="flex h-[calc(100vh-140px)] sm:h-[calc(95vh-140px)]">
        <!-- Colonne 1: Types de documents -->
        <div class="w-48 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
          <div class="p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Types de documents</h3>
            <div class="space-y-2">
              <div
                v-for="docType in documentTypes"
                :key="docType.id"
                @click="selectedDocType = docType.id"
                :class="`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedDocType === docType.id
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-600'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`"
              >
                <div class="flex items-center space-x-2">
                  <component :is="docType.icon" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white text-sm">{{ docType.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ docType.description }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne 2: Modèles -->
        <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Modèles {{ getDocTypeName() }}</h3>
              <button
                @click="createNewTemplate"
                class="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
              >
                <Plus class="w-3 h-3 inline mr-1" />
                Nouveau
              </button>
            </div>
            <div class="space-y-2">
              <div
                v-for="template in filteredTemplates"
                :key="template.id"
                @click="selectedTemplate = template.id"
                :class="`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTemplate === template.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white text-sm">{{ template.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ template.description }}</div>
                    <div class="flex items-center mt-2 space-x-2">
                      <span v-if="template.isDefault" class="inline-flex items-center px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Star class="w-3 h-3 mr-1" />
                        Par défaut
                      </span>
                      <span class="text-xs text-gray-500 dark:text-gray-400">{{ template.format }}</span>
                    </div>
                  </div>
                  <button
                    @click.stop="duplicateTemplate(template)"
                    class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    title="Dupliquer"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Colonne 3: Configuration -->
        <div class="flex-1 bg-white dark:bg-gray-800 overflow-y-auto">
          <div class="p-4" v-if="selectedTemplateData">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h3>
            
            <!-- Nom du modèle -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du modèle
              </label>
              <input
                v-model="selectedTemplateData.name"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="selectedTemplateData.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- Format de sortie -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Format de sortie
              </label>
              <select
                v-model="selectedTemplateData.format"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PDF">PDF</option>
                <option value="HTML">HTML</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>

            <!-- Définir comme modèle par défaut -->
            <div class="mb-6">
              <label class="flex items-center space-x-2">
                <input
                  v-model="selectedTemplateData.isDefault"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700 dark:text-gray-300">Définir comme modèle par défaut</span>
              </label>
            </div>

            <!-- Sections de configuration -->
            <div class="space-y-6">
              <!-- En-tête -->
              <TemplateSection
                title="En-tête"
                :icon="FileText"
                :fields="selectedTemplateData.sections.header"
                @update="updateSection('header', $event)"
              />

              <!-- Informations principales -->
              <TemplateSection
                title="Informations principales"
                :icon="Info"
                :fields="selectedTemplateData.sections.main"
                @update="updateSection('main', $event)"
              />

              <!-- Tableau -->
              <TemplateSection
                title="Tableau"
                :icon="Table"
                :fields="selectedTemplateData.sections.table"
                @update="updateSection('table', $event)"
              />

              <!-- Totaux -->
              <TemplateSection
                title="Totaux"
                :icon="Calculator"
                :fields="selectedTemplateData.sections.totals"
                @update="updateSection('totals', $event)"
              />

              <!-- Pied de page -->
              <TemplateSection
                title="Pied de page"
                :icon="FileText"
                :fields="selectedTemplateData.sections.footer"
                @update="updateSection('footer', $event)"
              />
            </div>
          </div>
        </div>

        <!-- Colonne 4: Aperçu -->
        <div class="w-96 bg-gray-50 dark:bg-gray-700 border-l border-gray-200 dark:border-gray-600 overflow-y-auto">
          <div class="p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Aperçu</h3>
              <div class="flex items-center space-x-2">
                <button
                  @click="previewMode = 'desktop'"
                  :class="`px-2 py-1 text-xs rounded ${
                    previewMode === 'desktop'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`"
                >
                  <Monitor class="w-3 h-3 inline mr-1" />
                  Bureau
                </button>
                <button
                  @click="previewMode = 'print'"
                  :class="`px-2 py-1 text-xs rounded ${
                    previewMode === 'print'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`"
                >
                  <Printer class="w-3 h-3 inline mr-1" />
                  Impression
                </button>
              </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div class="transform scale-50 origin-top-left w-[200%]">
                <GenericDocumentPreview
                  v-if="selectedTemplateData"
                  :template="selectedTemplateData"
                  :document-type="selectedDocumentType"
                  :sample-data="getSampleData()"
                  :mode="previewMode"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer avec bouton d'impression visible -->
      <div class="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ templates.length }} modèle(s) • {{ selectedTemplateData?.name || 'Aucun modèle sélectionné' }}
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
          <button
            @click="saveTemplate"
            class="px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            <Save class="w-4 h-4 inline mr-1" />
            Enregistrer
          </button>
          <!-- Bouton d'impression visible avec couleur bleue -->
          <button
            @click="handlePrint"
            class="px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg border-2 border-blue-700"
          >
            <Printer class="w-5 h-5 inline mr-2" />
            Impression
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  X, Settings, Plus, Star, Copy, Save, Printer, Monitor, FileText, Info, Table, Calculator
} from 'lucide-vue-next'
import TemplateSection from './TemplateSection.vue'
import GenericDocumentPreview from './GenericDocumentPreview.vue'

const props = defineProps({
  isOpen: Boolean,
  templates: Array
})

const emit = defineEmits(['close', 'save', 'delete', 'print'])

// État du composant
const selectedDocType = ref('invoice')
const selectedTemplate = ref('')
const previewMode = ref('desktop')

// Types de documents
const documentTypes = ref([
  {
    id: 'invoice',
    name: 'Factures',
    description: 'Factures de vente et d\'achat',
    icon: FileText
  },
  {
    id: 'order',
    name: 'Commandes',
    description: 'Bons de commande',
    icon: FileText
  },
  {
    id: 'delivery',
    name: 'Bons de livraison',
    description: 'Documents de livraison',
    icon: FileText
  },
  {
    id: 'quote',
    name: 'Devis',
    description: 'Devis et propositions commerciales',
    icon: FileText
  },
  {
    id: 'receipt',
    name: 'Reçus',
    description: 'Reçus de paiement',
    icon: FileText
  },
  {
    id: 'technical',
    name: 'Fiches techniques',
    description: 'Fiches techniques',
    icon: FileText
  }
])

// Modèles par défaut
const templates = ref([
  {
    id: 'invoice-standard',
    name: 'Facture Standard',
    description: 'Modèle standard pour factures',
    format: 'PDF',
    isDefault: true,
    documentType: 'invoice',
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true,
        logoPosition: 'left'
      },
      main: {
        showNumber: true,
        showDate: true,
        showDueDate: true,
        showClient: true,
        showClientAddress: true
      },
      table: {
        showDescription: true,
        showQuantity: true,
        showUnitPrice: true,
        showTotal: true
      },
      totals: {
        showSubtotal: true,
        showTax: true,
        showTotal: true
      },
      footer: {
        showPaymentInfo: true,
        showLegalMentions: true,
        showSignature: false
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6',
      fontFamily: 'Arial',
      fontSize: '12px'
    }
  }
])

// Computed properties
const filteredTemplates = computed(() => {
  return templates.value.filter(t => t.documentType === selectedDocType.value)
})

const selectedTemplateData = computed(() => {
  return templates.value.find(t => t.id === selectedTemplate.value)
})

const selectedDocumentType = computed(() => {
  return documentTypes.value.find(dt => dt.id === selectedDocType.value)
})

// Méthodes
const getDocTypeName = () => {
  const docType = documentTypes.value.find(dt => dt.id === selectedDocType.value)
  return docType ? docType.name : ''
}

const createNewTemplate = () => {
  const newTemplate = {
    id: `template-${Date.now()}`,
    name: `Nouveau modèle ${getDocTypeName()}`,
    description: 'Description du nouveau modèle',
    format: 'PDF',
    isDefault: false,
    documentType: selectedDocType.value,
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true
      },
      main: {
        showNumber: true,
        showDate: true,
        showClient: true
      },
      table: {
        showDescription: true,
        showQuantity: true,
        showTotal: true
      },
      totals: {
        showTotal: true
      },
      footer: {
        showLegalMentions: true
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6',
      fontFamily: 'Arial',
      fontSize: '12px'
    }
  }
  templates.value.push(newTemplate)
  selectedTemplate.value = newTemplate.id
}

const duplicateTemplate = (template) => {
  const duplicated = {
    ...template,
    id: `template-${Date.now()}`,
    name: `${template.name} (Copie)`,
    isDefault: false
  }
  templates.value.push(duplicated)
  selectedTemplate.value = duplicated.id
}

const updateSection = (sectionName, updatedFields) => {
  if (selectedTemplateData.value) {
    selectedTemplateData.value.sections[sectionName] = updatedFields
  }
}

const saveTemplate = () => {
  emit('save', selectedTemplateData.value)
}

const handlePrint = () => {
  if (selectedTemplateData.value) {
    emit('print', {
      template: selectedTemplateData.value,
      documentType: selectedDocumentType.value
    })
  }
}

const getSampleData = () => {
  return {
    number: 'FAC-2024-001',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    client: 'ACME Corporation',
    clientAddress: '123 Rue de la Paix\n75001 Paris\nFrance',
    items: [
      {
        description: 'Traitement galvanoplastie - Lot #001',
        quantity: 100,
        unitPrice: 10.00,
        total: 1000.00
      },
      {
        description: 'Contrôle qualité',
        quantity: 1,
        unitPrice: 250.00,
        total: 250.00
      }
    ],
    subtotal: 1250.00,
    tax: 250.00,
    total: 1500.00
  }
}

// Sélectionner le premier modèle à l'ouverture
watch(() => props.isOpen, (isOpen) => {
  if (isOpen && filteredTemplates.value.length > 0) {
    selectedTemplate.value = filteredTemplates.value[0].id
  }
})

watch(selectedDocType, () => {
  if (filteredTemplates.value.length > 0) {
    selectedTemplate.value = filteredTemplates.value[0].id
  } else {
    selectedTemplate.value = ''
  }
})
</script>