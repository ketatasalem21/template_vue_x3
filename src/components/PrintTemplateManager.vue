<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-7xl sm:max-h-[95vh] sm:w-auto sm:h-auto overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-purple-700">
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
        <div class="w-full sm:w-64 bg-gray-50 dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-48 sm:max-h-none">
          <div class="p-3 sm:p-4">
            <h3 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Types de documents</h3>
            <div class="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <button
                v-for="docType in documentTypes"
                :key="docType.id"
                @click="selectDocumentType(docType)"
                :class="`w-full text-left p-2 sm:p-3 rounded-lg transition-colors border text-xs sm:text-sm ${
                  selectedDocumentType?.id === docType.id
                    ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`"
              >
                <div class="flex items-center space-x-2 sm:space-x-3">
                  <component :is="docType.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <div class="min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white truncate">{{ docType.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{{ docType.description }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des modèles -->
        <div class="w-full sm:w-80 bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-64 sm:max-h-none">
          <div class="p-3 sm:p-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                Modèles {{ selectedDocumentType?.name || '' }}
              </h3>
              <button
                @click="createNewTemplate"
                :disabled="!selectedDocumentType"
                class="px-2 sm:px-3 py-1 bg-purple-600 text-white rounded text-xs sm:text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Plus class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                Nouveau
              </button>
            </div>

            <div v-if="selectedDocumentType" class="space-y-2">
              <div
                v-for="template in getTemplatesForType(selectedDocumentType.id)"
                :key="template.id"
                @click="selectTemplate(template)"
                :class="`p-2 sm:p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTemplate?.id === template.id
                    ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">{{ template.name }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">{{ template.description }}</div>
                    <div class="flex items-center space-x-1 sm:space-x-2 mt-1 sm:mt-2">
                      <div v-if="template.isDefault" class="inline-flex items-center px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Star class="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                        <span class="hidden sm:inline">Par défaut</span>
                        <span class="sm:hidden">Défaut</span>
                      </div>
                      <div class="inline-flex items-center px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        {{ template.format }}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-1 ml-2">
                    <button
                      @click.stop="duplicateTemplate(template)"
                      class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                      title="Dupliquer"
                    >
                      <Copy class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      v-if="!template.isDefault"
                      @click.stop="deleteTemplate(template)"
                      class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 class="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
              <FileText class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-xs sm:text-sm">Sélectionnez un type de document</p>
            </div>
          </div>
        </div>

        <!-- Configuration du modèle -->
        <div class="flex-1 flex flex-col">
          <!-- Panneau de configuration -->
          <div class="w-full bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto max-h-80 sm:max-h-none sm:w-96">
            <div v-if="selectedTemplate" class="p-3 sm:p-4 space-y-4 sm:space-y-6">
              <!-- Informations générales -->
              <div>
                <h4 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">Informations générales</h4>
                <div class="space-y-2 sm:space-y-3">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du modèle
                    </label>
                    <input
                      v-model="selectedTemplate.name"
                      type="text"
                      class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      v-model="selectedTemplate.description"
                      rows="2"
                      class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Format de sortie
                    </label>
                    <select
                      v-model="selectedTemplate.format"
                      class="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="PDF">PDF</option>
                      <option value="HTML">HTML</option>
                      <option value="DOCX">Word</option>
                      <option value="XLSX">Excel</option>
                    </select>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="selectedTemplate.isDefault"
                      type="checkbox"
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Définir comme modèle par défaut
                    </label>
                  </div>
                </div>
              </div>

              <!-- Configuration des sections (version simplifiée pour mobile) -->
              <div class="space-y-3 sm:space-y-4">
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

                <!-- Données tabulaires -->
                <TemplateSection
                  title="Données tabulaires"
                  :icon="Table"
                  :fields="selectedTemplate.sections.table"
                  @update="updateSection('table', $event)"
                />

                <!-- Totaux et calculs -->
                <TemplateSection
                  title="Totaux et calculs"
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

                <!-- Style et mise en page -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="text-xs sm:text-sm font-medium text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center">
                    <Palette class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Style et mise en page
                  </h5>
                  <div class="space-y-2 sm:space-y-3">
                    <div class="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur principale
                        </label>
                        <input
                          v-model="selectedTemplate.styling.primaryColor"
                          type="color"
                          class="w-full h-8 sm:h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur secondaire
                        </label>
                        <input
                          v-model="selectedTemplate.styling.secondaryColor"
                          type="color"
                          class="w-full h-8 sm:h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Police
                        </label>
                        <select
                          v-model="selectedTemplate.styling.fontFamily"
                          class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Taille
                        </label>
                        <select
                          v-model="selectedTemplate.styling.fontSize"
                          class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value="10px">10px</option>
                          <option value="11px">11px</option>
                          <option value="12px">12px</option>
                          <option value="14px">14px</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mise en page
                      </label>
                      <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center space-x-2">
                          <input
                            v-model="selectedTemplate.styling.orientation"
                            type="radio"
                            value="portrait"
                            class="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                          />
                          <span class="text-xs">Portrait</span>
                        </label>
                        <label class="flex items-center space-x-2">
                          <input
                            v-model="selectedTemplate.styling.orientation"
                            type="radio"
                            value="landscape"
                            class="w-3 h-3 sm:w-4 sm:h-4 text-purple-600"
                          />
                          <span class="text-xs">Paysage</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-xs sm:text-sm">Sélectionnez un modèle pour le configurer</p>
            </div>
          </div>

          <!-- Aperçu -->
          <div class="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
            <div class="p-3 sm:p-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
                <h4 class="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">Aperçu</h4>
                <div class="flex items-center space-x-1 sm:space-x-2">
                  <button
                    @click="previewMode = 'desktop'"
                    :class="`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors ${
                      previewMode === 'desktop'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`"
                  >
                    <Monitor class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    <span class="hidden sm:inline">Bureau</span>
                    <span class="sm:hidden">PC</span>
                  </button>
                  <button
                    @click="previewMode = 'print'"
                    :class="`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded transition-colors ${
                      previewMode === 'print'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`"
                  >
                    <Printer class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                    <span class="hidden sm:inline">Impression</span>
                    <span class="sm:hidden">Print</span>
                  </button>
                </div>
              </div>

              <div v-if="selectedTemplate && selectedDocumentType" class="bg-white rounded-lg shadow-lg p-3 sm:p-8 max-w-4xl mx-auto">
                <div class="transform scale-50 sm:scale-75 lg:scale-100 origin-top">
                  <GenericDocumentPreview
                    :template="selectedTemplate"
                    :document-type="selectedDocumentType"
                    :sample-data="getSampleDataForType(selectedDocumentType.id)"
                    :mode="previewMode"
                  />
                </div>
              </div>

              <div v-else class="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-4xl mx-auto text-center text-gray-500">
                <Eye class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <p class="text-xs sm:text-sm">Sélectionnez un modèle pour voir l'aperçu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-3 sm:gap-0">
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          {{ templates.length }} modèle(s) configuré(s)
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
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
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
  isOpen: Boolean
})

const emit = defineEmits(['close', 'save', 'delete'])

const selectedDocumentType = ref(null)
const selectedTemplate = ref(null)
const previewMode = ref('desktop')

// Types de documents supportés
const documentTypes = ref([
  {
    id: 'invoice',
    name: 'Factures',
    description: 'Factures de vente et d\'achat',
    icon: Receipt,
    fields: ['number', 'date', 'dueDate', 'client', 'items', 'totals', 'paymentTerms']
  },
  {
    id: 'order',
    name: 'Commandes',
    description: 'Bons de commande',
    icon: ShoppingCart,
    fields: ['number', 'date', 'supplier', 'items', 'deliveryDate', 'terms']
  },
  {
    id: 'delivery',
    name: 'Bons de livraison',
    description: 'Documents de livraison',
    icon: Truck,
    fields: ['number', 'date', 'client', 'items', 'deliveryAddress', 'carrier']
  },
  {
    id: 'quote',
    name: 'Devis',
    description: 'Devis et propositions commerciales',
    icon: FileText,
    fields: ['number', 'date', 'validityDate', 'client', 'items', 'totals', 'conditions']
  },
  {
    id: 'receipt',
    name: 'Reçus',
    description: 'Reçus de paiement',
    icon: CreditCard,
    fields: ['number', 'date', 'amount', 'client', 'paymentMethod', 'reference']
  },
  {
    id: 'technical_sheet',
    name: 'Fiches techniques',
    description: 'Fiches techniques produits',
    icon: Wrench,
    fields: ['productCode', 'name', 'specifications', 'dimensions', 'materials', 'instructions']
  },
  {
    id: 'inventory',
    name: 'Inventaires',
    description: 'États d\'inventaire',
    icon: Package,
    fields: ['date', 'location', 'items', 'quantities', 'values', 'responsible']
  },
  {
    id: 'report',
    name: 'Rapports',
    description: 'Rapports d\'activité',
    icon: BarChart3,
    fields: ['title', 'period', 'data', 'charts', 'analysis', 'conclusions']
  },
  {
    id: 'contact_sheet',
    name: 'Fiches contact',
    description: 'Fiches clients/fournisseurs',
    icon: Users,
    fields: ['name', 'address', 'contact', 'history', 'notes', 'contracts']
  }
])

// Modèles d'impression
const templates = ref([
  // Modèles pour factures
  {
    id: 'invoice-standard',
    documentType: 'invoice',
    name: 'Facture Standard',
    description: 'Modèle standard pour factures',
    format: 'PDF',
    isDefault: true,
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
      secondaryColor: '#f3f4f6',
      fontFamily: 'Arial',
      fontSize: '12px',
      orientation: 'portrait'
    }
  },
  // Modèles pour commandes
  {
    id: 'order-standard',
    documentType: 'order',
    name: 'Commande Standard',
    description: 'Modèle standard pour bons de commande',
    format: 'PDF',
    isDefault: true,
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
        showDiscount: true
      },
      footer: {
        showTerms: true,
        showLegalMentions: true,
        showSignature: true
      }
    },
    styling: {
      primaryColor: '#059669',
      secondaryColor: '#ecfdf5',
      fontFamily: 'Arial',
      fontSize: '12px',
      orientation: 'portrait'
    }
  }
])

// Computed properties
const getTemplatesForType = (documentTypeId) => {
  return templates.value.filter(template => template.documentType === documentTypeId)
}

const getSampleDataForType = (documentTypeId) => {
  const sampleData = {
    invoice: {
      number: 'FAC-2024-001',
      date: '2024-01-15',
      dueDate: '2024-02-15',
      client: 'ACME Corporation',
      clientAddress: '123 Rue de la Paix\n75001 Paris\nFrance',
      items: [
        { description: 'Traitement galvanoplastie', quantity: 100, unitPrice: 10.00, total: 1000.00 },
        { description: 'Contrôle qualité', quantity: 1, unitPrice: 250.00, total: 250.00 }
      ],
      subtotal: 1250.00,
      tax: 250.00,
      total: 1500.00
    },
    order: {
      number: 'CMD-2024-001',
      date: '2024-01-15',
      deliveryDate: '2024-01-30',
      supplier: 'Fournisseur Chimie SA',
      supplierAddress: '456 Avenue Industrielle\n69000 Lyon\nFrance',
      items: [
        { description: 'Solution de nickelage', quantity: 50, unitPrice: 25.00, total: 1250.00 },
        { description: 'Additifs brillanteur', quantity: 10, unitPrice: 45.00, total: 450.00 }
      ],
      subtotal: 1700.00,
      tax: 340.00,
      total: 2040.00
    },
    technical_sheet: {
      productCode: 'TECH-001',
      name: 'Processus Nickelage Brillant',
      specifications: 'Température: 50-55°C\nPH: 4.0-4.5\nDensité de courant: 2-4 A/dm²',
      materials: 'Sulfate de nickel, Chlorure de nickel, Acide borique',
      instructions: 'Préparation du bain selon protocole P-001'
    }
  }
  return sampleData[documentTypeId] || {}
}

// Méthodes
const selectDocumentType = (docType) => {
  selectedDocumentType.value = docType
  selectedTemplate.value = null
}

const selectTemplate = (template) => {
  selectedTemplate.value = { ...template }
}

const createNewTemplate = () => {
  if (!selectedDocumentType.value) return

  const newTemplate = {
    id: `template-${Date.now()}`,
    documentType: selectedDocumentType.value.id,
    name: `Nouveau modèle ${selectedDocumentType.value.name}`,
    description: `Modèle personnalisé pour ${selectedDocumentType.value.name.toLowerCase()}`,
    format: 'PDF',
    isDefault: false,
    sections: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showTitle: true,
        logoPosition: 'left'
      },
      main: {
        showNumber: true,
        showDate: true
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
        showLegalMentions: true
      }
    },
    styling: {
      primaryColor: '#073a6f',
      secondaryColor: '#f3f4f6',
      fontFamily: 'Arial',
      fontSize: '12px',
      orientation: 'portrait'
    }
  }
  selectedTemplate.value = newTemplate
}

const duplicateTemplate = (template) => {
  const duplicated = {
    ...template,
    id: `template-${Date.now()}`,
    name: `${template.name} (Copie)`,
    isDefault: false
  }
  selectedTemplate.value = duplicated
}

const deleteTemplate = (template) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le modèle "${template.name}" ?`)) {
    emit('delete', template.id)
    if (selectedTemplate.value?.id === template.id) {
      selectedTemplate.value = null
    }
  }
}

const updateSection = (sectionName, fields) => {
  if (selectedTemplate.value) {
    selectedTemplate.value.sections[sectionName] = { ...fields }
  }
}

const saveTemplate = () => {
  if (selectedTemplate.value) {
    const existingIndex = templates.value.findIndex(t => t.id === selectedTemplate.value.id)
    if (existingIndex > -1) {
      templates.value[existingIndex] = { ...selectedTemplate.value }
    } else {
      templates.value.push({ ...selectedTemplate.value })
    }
    emit('save', selectedTemplate.value)
  }
}
</script>