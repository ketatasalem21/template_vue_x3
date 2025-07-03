<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-7xl sm:max-h-[95vh] sm:w-auto sm:h-auto overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700" style="background: linear-gradient(to right, rgb(7, 58, 111), rgb(9, 70, 133));">
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Settings class="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
          <h2 class="text-sm sm:text-xl font-semibold text-white truncate">Gestionnaire de Modèles d'Impression</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-col sm:flex-row h-[calc(100vh-60px)] sm:h-[calc(95vh-80px)]">
        <!-- Sidebar - Types de documents -->
        <div class="w-full sm:w-80 bg-gray-50 dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div class="p-3 sm:p-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Types de documents</h3>
            <div class="space-y-2">
              <div
                v-for="docType in documentTypes"
                :key="docType.id"
                @click="selectDocumentType(docType)"
                :class="`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedDocumentType?.id === docType.id
                    ? 'border-gray-300 dark:border-gray-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`"
                :style="selectedDocumentType?.id === docType.id ? 'background-color: rgb(7, 58, 111);' : ''"
              >
                <div class="flex items-center space-x-3">
                  <component :is="docType.icon" class="w-5 h-5" />
                  <div class="flex-1">
                    <div class="font-medium">{{ docType.name }}</div>
                    <div class="text-sm opacity-75 mt-1">{{ docType.description }}</div>
                    <div class="text-xs opacity-60 mt-1">
                      {{ getTemplateCount(docType.id) }} modèle(s)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="flex-1 flex flex-col sm:flex-row">
          <!-- Liste des modèles -->
          <div class="w-full sm:w-80 bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div v-if="selectedDocumentType" class="p-3 sm:p-4">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  Modèles {{ selectedDocumentType.name }}
                </h3>
                <button
                  @click="createNewTemplate"
                  class="px-3 py-1 text-white rounded text-sm hover:opacity-80 transition-colors"
                  style="background-color: rgb(7, 58, 111);"
                >
                  <Plus class="w-4 h-4 inline mr-1" />
                  Nouveau
                </button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="template in filteredTemplates"
                  :key="template.id"
                  @click="selectTemplate(template)"
                  :class="`p-3 rounded-lg cursor-pointer transition-colors border ${
                    selectedTemplate?.id === template.id
                      ? 'border-gray-300 dark:border-gray-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`"
                  :style="selectedTemplate?.id === template.id ? 'background-color: rgb(7, 58, 111);' : ''"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="font-medium">{{ template.name }}</div>
                      <div class="text-sm opacity-75 mt-1">{{ template.description }}</div>
                      <div v-if="template.isDefault" class="mt-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Star class="w-3 h-3 mr-1" />
                          Par défaut
                        </span>
                      </div>
                    </div>
                    <div class="flex items-center space-x-1">
                      <button
                        @click.stop="duplicateTemplate(template)"
                        class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                        title="Dupliquer"
                      >
                        <Copy class="w-4 h-4" />
                      </button>
                      <button
                        v-if="!template.isDefault"
                        @click.stop="deleteTemplate(template)"
                        class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Sélectionnez un type de document pour voir les modèles</p>
            </div>
          </div>

          <!-- Configuration et aperçu -->
          <div class="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div v-if="selectedTemplate" class="p-3 sm:p-4 space-y-6">
              <!-- Informations générales -->
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du modèle
                    </label>
                    <input
                      v-model="selectedTemplate.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      v-model="selectedTemplate.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="selectedTemplate.isDefault"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label class="text-sm text-gray-700 dark:text-gray-300">
                      Définir comme modèle par défaut
                    </label>
                  </div>
                </div>
              </div>

              <!-- Configuration des sections -->
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuration des sections</h4>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <!-- En-tête -->
                  <TemplateSection
                    title="En-tête"
                    :icon="FileText"
                    :fields="selectedTemplate.sections.header"
                    @update="updateSection('header', $event)"
                  />

                  <!-- Informations principales -->
                  <TemplateSection
                    title="Informations principales"
                    :icon="Info"
                    :fields="selectedTemplate.sections.main"
                    @update="updateSection('main', $event)"
                  />

                  <!-- Tableau -->
                  <TemplateSection
                    title="Tableau"
                    :icon="Table"
                    :fields="selectedTemplate.sections.table"
                    @update="updateSection('table', $event)"
                  />

                  <!-- Totaux -->
                  <TemplateSection
                    title="Totaux"
                    :icon="Calculator"
                    :fields="selectedTemplate.sections.totals"
                    @update="updateSection('totals', $event)"
                  />

                  <!-- Pied de page -->
                  <TemplateSection
                    title="Pied de page"
                    :icon="FileText"
                    :fields="selectedTemplate.sections.footer"
                    @update="updateSection('footer', $event)"
                  />

                  <!-- Style -->
                  <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                      <Palette class="w-4 h-4 mr-2" />
                      Style et apparence
                    </h5>
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur principale
                        </label>
                        <input
                          v-model="selectedTemplate.styling.primaryColor"
                          type="color"
                          class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur secondaire
                        </label>
                        <input
                          v-model="selectedTemplate.styling.secondaryColor"
                          type="color"
                          class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Aperçu -->
              <div class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Aperçu</h4>
                  <div class="flex items-center space-x-2">
                    <button
                      @click="previewMode = 'desktop'"
                      :class="`px-3 py-1 text-sm rounded transition-colors ${
                        previewMode === 'desktop'
                          ? 'text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`"
                      :style="previewMode === 'desktop' ? 'background-color: rgb(7, 58, 111);' : ''"
                    >
                      <Monitor class="w-4 h-4 inline mr-1" />
                      Bureau
                    </button>
                    <button
                      @click="previewMode = 'print'"
                      :class="`px-3 py-1 text-sm rounded transition-colors ${
                        previewMode === 'print'
                          ? 'text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`"
                      :style="previewMode === 'print' ? 'background-color: rgb(7, 58, 111);' : ''"
                    >
                      <Printer class="w-4 h-4 inline mr-1" />
                      Impression
                    </button>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div class="bg-white rounded shadow-lg p-6 max-w-2xl mx-auto transform scale-75 origin-top">
                    <GenericDocumentPreview
                      :template="selectedTemplate"
                      :document-type="selectedDocumentType"
                      :sample-data="getSampleData(selectedDocumentType.id)"
                      :mode="previewMode"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
              <Eye class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Sélectionnez un modèle pour le configurer</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-3 sm:gap-0">
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          {{ allTemplates.length }} modèle(s) configuré(s)
        </div>
        <div class="flex space-x-2 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
          <button
            v-if="selectedTemplate"
            @click="saveTemplate"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-white rounded hover:opacity-80 transition-colors"
            style="background-color: rgb(7, 58, 111);"
          >
            <Save class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Settings, X, Plus, Star, Copy, Trash2, FileText, Info, Table, Calculator,
  Palette, Monitor, Printer, Eye, Save, Receipt, Package, Truck, CreditCard,
  BarChart3, Users, ShoppingCart, Wrench
} from 'lucide-vue-next'
import TemplateSection from './TemplateSection.vue'
import GenericDocumentPreview from './GenericDocumentPreview.vue'

const props = defineProps({
  isOpen: Boolean,
  templates: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save', 'delete'])

const selectedDocumentType = ref(null)
const selectedTemplate = ref(null)
const previewMode = ref('desktop')

// Types de documents disponibles
const documentTypes = ref([
  {
    id: 'invoice',
    name: 'Factures',
    description: 'Factures de vente et d\'achat',
    icon: Receipt
  },
  {
    id: 'order',
    name: 'Bons de commande',
    description: 'Commandes clients et fournisseurs',
    icon: ShoppingCart
  },
  {
    id: 'delivery',
    name: 'Bons de livraison',
    description: 'Documents de livraison',
    icon: Truck
  },
  {
    id: 'quote',
    name: 'Devis',
    description: 'Devis et propositions commerciales',
    icon: CreditCard
  },
  {
    id: 'receipt',
    name: 'Reçus',
    description: 'Reçus de paiement',
    icon: Receipt
  },
  {
    id: 'technical_sheet',
    name: 'Fiches techniques',
    description: 'Documentation technique',
    icon: Wrench
  },
  {
    id: 'inventory',
    name: 'Inventaires',
    description: 'États d\'inventaire',
    icon: Package
  },
  {
    id: 'report',
    name: 'Rapports',
    description: 'Rapports d\'activité',
    icon: BarChart3
  },
  {
    id: 'contact_sheet',
    name: 'Fiches contact',
    description: 'Fiches de contact client/fournisseur',
    icon: Users
  }
])

// Modèles par défaut
const allTemplates = ref([
  {
    id: 'invoice-standard',
    documentType: 'invoice',
    name: 'Facture Standard',
    description: 'Modèle standard pour factures',
    isDefault: true,
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true
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
        showTotal: true,
        showDiscount: false
      },
      footer: {
        showPaymentInfo: true,
        showLegalMentions: true,
        showSignature: false
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6'
    }
  },
  {
    id: 'order-standard',
    documentType: 'order',
    name: 'Bon de commande Standard',
    description: 'Modèle standard pour bons de commande',
    isDefault: true,
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true
      },
      main: {
        showNumber: true,
        showDate: true,
        showDeliveryDate: true,
        showSupplier: true,
        showSupplierAddress: true
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
        showTotal: true,
        showDiscount: false
      },
      footer: {
        showTerms: true,
        showLegalMentions: true,
        showSignature: true
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6'
    }
  }
])

// Computed properties
const filteredTemplates = computed(() => {
  if (!selectedDocumentType.value) return []
  return allTemplates.value.filter(template => 
    template.documentType === selectedDocumentType.value.id
  )
})

// Méthodes
const selectDocumentType = (docType) => {
  selectedDocumentType.value = docType
  selectedTemplate.value = null
}

const selectTemplate = (template) => {
  selectedTemplate.value = { ...template }
}

const getTemplateCount = (documentTypeId) => {
  return allTemplates.value.filter(template => 
    template.documentType === documentTypeId
  ).length
}

const createNewTemplate = () => {
  if (!selectedDocumentType.value) return
  
  const newTemplate = {
    id: `template-${Date.now()}`,
    documentType: selectedDocumentType.value.id,
    name: `Nouveau modèle ${selectedDocumentType.value.name}`,
    description: `Description du nouveau modèle`,
    isDefault: false,
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true
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
        showTotal: true,
        showDiscount: false
      },
      footer: {
        showPaymentInfo: true,
        showLegalMentions: true,
        showSignature: false
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6'
    }
  }
  
  allTemplates.value.push(newTemplate)
  selectedTemplate.value = newTemplate
}

const duplicateTemplate = (template) => {
  const duplicated = {
    ...template,
    id: `template-${Date.now()}`,
    name: `${template.name} (Copie)`,
    isDefault: false
  }
  allTemplates.value.push(duplicated)
  selectedTemplate.value = duplicated
}

const deleteTemplate = (template) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${template.name}" ?`)) {
    const index = allTemplates.value.findIndex(t => t.id === template.id)
    if (index > -1) {
      allTemplates.value.splice(index, 1)
      if (selectedTemplate.value?.id === template.id) {
        selectedTemplate.value = null
      }
    }
  }
}

const updateSection = (sectionName, fields) => {
  if (selectedTemplate.value) {
    selectedTemplate.value.sections[sectionName] = fields
  }
}

const saveTemplate = () => {
  if (selectedTemplate.value) {
    const index = allTemplates.value.findIndex(t => t.id === selectedTemplate.value.id)
    if (index > -1) {
      allTemplates.value[index] = { ...selectedTemplate.value }
    }
    emit('save', selectedTemplate.value)
  }
}

const getSampleData = (documentTypeId) => {
  const sampleData = {
    invoice: {
      number: 'FAC-2024-001',
      client: 'ACME Corporation',
      clientAddress: '123 Rue de la Paix\n75001 Paris\nFrance',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      subtotal: 1250.00,
      tax: 250.00,
      total: 1500.00,
      items: [
        { description: 'Traitement galvanoplastie - Lot #001', quantity: 100, unitPrice: 10.00, total: 1000.00 },
        { description: 'Contrôle qualité', quantity: 1, unitPrice: 250.00, total: 250.00 }
      ]
    },
    order: {
      number: 'CMD-2024-001',
      supplier: 'Fournisseur Galvano',
      supplierAddress: '456 Avenue Industrielle\n69000 Lyon\nFrance',
      date: '2024-01-15',
      deliveryDate: '2024-01-30',
      subtotal: 2100.00,
      tax: 420.00,
      total: 2520.00,
      items: [
        { description: 'Produits chimiques - Nickel', quantity: 50, unitPrice: 35.00, total: 1750.00 },
        { description: 'Équipement de sécurité', quantity: 10, unitPrice: 35.00, total: 350.00 }
      ]
    }
  }
  
  return sampleData[documentTypeId] || sampleData.invoice
}
</script>