<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full max-h-screen rounded-none
        sm:rounded-lg sm:max-w-7xl sm:max-h-[95vh] sm:w-auto sm:h-auto"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700" style="background: linear-gradient(to right, rgb(7, 58, 111), rgb(9, 70, 133));">
        <div class="flex items-center space-x-3">
          <Settings class="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 class="text-base sm:text-xl font-semibold text-white">Gestionnaire de Modèles d'Impression</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors p-1"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-col sm:flex-row h-[calc(100vh-80px)] sm:h-[calc(95vh-80px)]">
        <!-- Sidebar - Types de documents -->
        <div class="w-full sm:w-64 bg-gray-50 dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div class="p-3 sm:p-4">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Types de documents</h3>
            <div class="space-y-2">
              <button
                v-for="docType in documentTypes"
                :key="docType.id"
                @click="selectDocumentType(docType)"
                :class="`w-full text-left p-3 rounded-lg transition-colors border ${
                  selectedDocumentType?.id === docType.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`"
              >
                <div class="flex items-center space-x-3">
                  <component :is="docType.icon" class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{{ docType.name }}</div>
                    <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ docType.description }}</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Liste des modèles -->
        <div class="w-full sm:w-80 bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div class="p-3 sm:p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Modèles {{ selectedDocumentType?.name || '' }}
              </h3>
              <button
                @click="createNewTemplate"
                :disabled="!selectedDocumentType"
                class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus class="w-4 h-4 inline mr-1" />
                Nouveau
              </button>
            </div>

            <div v-if="selectedDocumentType" class="space-y-2">
              <div
                v-for="template in getTemplatesForType(selectedDocumentType.id)"
                :key="template.id"
                @click="selectTemplate(template)"
                :class="`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{{ template.name }}</div>
                    <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{{ template.description }}</div>
                    <div class="flex items-center space-x-2 mt-2">
                      <div v-if="template.isDefault" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Star class="w-3 h-3 mr-1" />
                        Par défaut
                      </div>
                      <div class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
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

            <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-sm">Sélectionnez un type de document</p>
            </div>
          </div>
        </div>

        <!-- Configuration du modèle -->
        <div class="flex-1 flex flex-col sm:flex-row">
          <!-- Panneau de configuration -->
          <div class="w-full sm:w-96 bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div v-if="selectedTemplate" class="p-3 sm:p-4 space-y-4 sm:space-y-6">
              <!-- Informations générales -->
              <div>
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du modèle
                    </label>
                    <input
                      v-model="selectedTemplate.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      v-model="selectedTemplate.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Format de sortie
                    </label>
                    <select
                      v-model="selectedTemplate.format"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label class="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      Définir comme modèle par défaut
                    </label>
                  </div>
                </div>
              </div>

              <!-- Configuration des sections -->
              <div class="space-y-4">
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
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Palette class="w-4 h-4 mr-2" />
                    Style et mise en page
                  </h5>
                  <div class="space-y-3">
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur principale
                        </label>
                        <input
                          v-model="selectedTemplate.styling.primaryColor"
                          type="color"
                          class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                      <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Couleur secondaire
                        </label>
                        <input
                          v-model="selectedTemplate.styling.secondaryColor"
                          type="color"
                          class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Police
                        </label>
                        <select
                          v-model="selectedTemplate.styling.fontFamily"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Helvetica">Helvetica</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Taille
                        </label>
                        <select
                          v-model="selectedTemplate.styling.fontSize"
                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="10px">10px</option>
                          <option value="11px">11px</option>
                          <option value="12px">12px</option>
                          <option value="14px">14px</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Mise en page
                      </label>
                      <div class="grid grid-cols-2 gap-2">
                        <label class="flex items-center space-x-2">
                          <input
                            v-model="selectedTemplate.styling.orientation"
                            type="radio"
                            value="portrait"
                            class="w-4 h-4 text-blue-600"
                          />
                          <span class="text-sm">Portrait</span>
                        </label>
                        <label class="flex items-center space-x-2">
                          <input
                            v-model="selectedTemplate.styling.orientation"
                            type="radio"
                            value="landscape"
                            class="w-4 h-4 text-blue-600"
                          />
                          <span class="text-sm">Paysage</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-sm">Sélectionnez un modèle pour le configurer</p>
            </div>
          </div>

          <!-- Aperçu -->
          <div class="flex-1 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
            <div class="p-3 sm:p-4">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Aperçu</h4>
                <div class="flex items-center space-x-2">
                  <button
                    @click="previewMode = 'desktop'"
                    :class="`px-3 py-1 text-sm rounded transition-colors ${
                      previewMode === 'desktop'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`"
                  >
                    <Monitor class="w-4 h-4 inline mr-1" />
                    Bureau
                  </button>
                  <button
                    @click="previewMode = 'print'"
                    :class="`px-3 py-1 text-sm rounded transition-colors ${
                      previewMode === 'print'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`"
                  >
                    <Printer class="w-4 h-4 inline mr-1" />
                    Impression
                  </button>
                </div>
              </div>

              <div v-if="selectedTemplate && selectedDocumentType" class="bg-white rounded-lg shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
                <GenericDocumentPreview
                  :template="selectedTemplate"
                  :document-type="selectedDocumentType"
                  :sample-data="getSampleDataForType(selectedDocumentType.id)"
                  :mode="previewMode"
                />
              </div>

              <div v-else class="bg-white rounded-lg shadow-lg p-4 sm:p-8 max-w-4xl mx-auto text-center text-gray-500">
                <Eye class="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 text-gray-300" />
                <p class="text-sm">Sélectionnez un modèle pour voir l'aperçu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-3 sm:gap-0">
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {{ templates.length }} modèle(s) configuré(s)
        </div>
        <div class="flex space-x-3 w-full sm:w-auto">
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
          <button
            v-if="selectedTemplate"
            @click="saveTemplate"
            class="flex-1 sm:flex-none px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            <Save class="w-4 h-4 inline mr-1" />
            Enregistrer
          </button>
          <button
            v-if="selectedTemplate && selectedDocumentType"
            @click="printTemplate"
            class="flex-1 sm:flex-none px-4 py-2 text-sm text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
          >
            <Printer class="w-4 h-4 inline mr-1" />
            Imprimer
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

const emit = defineEmits(['close', 'save', 'delete', 'print'])

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

const printTemplate = () => {
  if (selectedTemplate.value && selectedDocumentType.value) {
    const printConfig = {
      template: selectedTemplate.value,
      documentType: selectedDocumentType.value,
      sampleData: getSampleDataForType(selectedDocumentType.value.id),
      mode: previewMode.value
    }
    
    // Émettre l'événement d'impression
    emit('print', printConfig)
    
    // Ouvrir la fenêtre d'impression
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Impression - ${selectedTemplate.value.name}</title>
            <style>
              body { 
                font-family: ${selectedTemplate.value.styling.fontFamily}, sans-serif; 
                font-size: ${selectedTemplate.value.styling.fontSize};
                margin: 20px; 
                color: #374151;
              }
              .document-preview { max-width: 800px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: ${selectedTemplate.value.styling.secondaryColor}; font-weight: bold; }
              .header { margin-bottom: 30px; }
              .company-info h1 { color: ${selectedTemplate.value.styling.primaryColor}; margin: 0; }
              .totals { margin-top: 20px; }
              .total-line { display: flex; justify-content: space-between; margin: 5px 0; }
              .total-final { font-weight: bold; font-size: 1.2em; color: ${selectedTemplate.value.styling.primaryColor}; }
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
              ${generatePrintContent()}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }
}

const generatePrintContent = () => {
  if (!selectedTemplate.value || !selectedDocumentType.value) return ''
  
  const sampleData = getSampleDataForType(selectedDocumentType.value.id)
  let content = ''
  
  // En-tête
  if (selectedTemplate.value.sections.header.showCompanyInfo || selectedTemplate.value.sections.header.showTitle) {
    content += '<div class="header">'
    if (selectedTemplate.value.sections.header.showCompanyInfo) {
      content += `
        <div class="company-info">
          <h1>Sage X3 Galvanoplastie</h1>
          <div style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">
            <p>123 Rue de l'Industrie</p>
            <p>69000 Lyon, France</p>
            <p>Tél: +33 4 72 00 00 00</p>
          </div>
        </div>
      `
    }
    if (selectedTemplate.value.sections.header.showTitle) {
      content += `<h2 style="color: ${selectedTemplate.value.styling.primaryColor}; text-align: center; margin: 20px 0;">${selectedDocumentType.value.name.toUpperCase()}</h2>`
    }
    content += '</div>'
  }
  
  // Informations principales
  if (selectedTemplate.value.sections.main.showNumber || selectedTemplate.value.sections.main.showDate) {
    content += '<div style="margin-bottom: 30px;">'
    content += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">'
    
    // Informations client/fournisseur
    if (sampleData.client || sampleData.supplier) {
      content += '<div>'
      content += `<h3 style="color: ${selectedTemplate.value.styling.primaryColor}; margin-bottom: 10px;">${sampleData.client ? 'Client' : 'Fournisseur'}:</h3>`
      content += `<p style="font-weight: bold;">${sampleData.client || sampleData.supplier}</p>`
      if (sampleData.clientAddress || sampleData.supplierAddress) {
        content += `<div style="white-space: pre-line; color: #6b7280;">${sampleData.clientAddress || sampleData.supplierAddress}</div>`
      }
      content += '</div>'
    }
    
    // Informations document
    content += '<div>'
    if (selectedTemplate.value.sections.main.showNumber && sampleData.number) {
      content += `<div class="total-line"><span>Numéro:</span><span>${sampleData.number}</span></div>`
    }
    if (selectedTemplate.value.sections.main.showDate && sampleData.date) {
      content += `<div class="total-line"><span>Date:</span><span>${new Date(sampleData.date).toLocaleDateString('fr-FR')}</span></div>`
    }
    if (selectedTemplate.value.sections.main.showDueDate && sampleData.dueDate) {
      content += `<div class="total-line"><span>Échéance:</span><span>${new Date(sampleData.dueDate).toLocaleDateString('fr-FR')}</span></div>`
    }
    content += '</div>'
    
    content += '</div></div>'
  }
  
  // Tableau des articles
  if (selectedTemplate.value.sections.table.showDescription && sampleData.items) {
    content += '<table>'
    content += '<thead><tr>'
    if (selectedTemplate.value.sections.table.showDescription) content += '<th>Description</th>'
    if (selectedTemplate.value.sections.table.showQuantity) content += '<th style="text-align: center;">Qté</th>'
    if (selectedTemplate.value.sections.table.showUnitPrice) content += '<th style="text-align: right;">Prix unit.</th>'
    if (selectedTemplate.value.sections.table.showTotal) content += '<th style="text-align: right;">Total</th>'
    content += '</tr></thead>'
    content += '<tbody>'
    
    sampleData.items.forEach(item => {
      content += '<tr>'
      if (selectedTemplate.value.sections.table.showDescription) content += `<td>${item.description}</td>`
      if (selectedTemplate.value.sections.table.showQuantity) content += `<td style="text-align: center;">${item.quantity}</td>`
      if (selectedTemplate.value.sections.table.showUnitPrice) content += `<td style="text-align: right;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.unitPrice)}</td>`
      if (selectedTemplate.value.sections.table.showTotal) content += `<td style="text-align: right; font-weight: bold;">${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(item.total)}</td>`
      content += '</tr>'
    })
    
    content += '</tbody></table>'
  }
  
  // Totaux
  if (selectedTemplate.value.sections.totals.showSubtotal && sampleData.subtotal) {
    content += '<div class="totals" style="text-align: right;">'
    content += '<div style="width: 300px; margin-left: auto;">'
    if (selectedTemplate.value.sections.totals.showSubtotal) {
      content += `<div class="total-line"><span>Sous-total:</span><span>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(sampleData.subtotal)}</span></div>`
    }
    if (selectedTemplate.value.sections.totals.showTax && sampleData.tax) {
      content += `<div class="total-line"><span>TVA:</span><span>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(sampleData.tax)}</span></div>`
    }
    if (selectedTemplate.value.sections.totals.showTotal && sampleData.total) {
      content += `<div class="total-line total-final" style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;"><span>Total:</span><span>${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(sampleData.total)}</span></div>`
    }
    content += '</div></div>'
  }
  
  // Pied de page
  if (selectedTemplate.value.sections.footer.showPaymentInfo || selectedTemplate.value.sections.footer.showLegalMentions) {
    content += '<div style="margin-top: 40px;">'
    if (selectedTemplate.value.sections.footer.showPaymentInfo) {
      content += `
        <div style="margin-bottom: 20px;">
          <h4 style="color: ${selectedTemplate.value.styling.primaryColor};">Informations de paiement</h4>
          <div style="font-size: 0.9em; color: #6b7280;">
            <p>Banque: Crédit Lyonnais</p>
            <p>IBAN: FR76 3000 3000 1100 0000 1234 567</p>
            <p>BIC: CCFRFRPP</p>
          </div>
        </div>
      `
    }
    if (selectedTemplate.value.sections.footer.showLegalMentions) {
      content += `
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 20px;">
          <p style="font-size: 0.8em; color: #6b7280; text-align: center;">
            Sage X3 Galvanoplastie - SAS au capital de 100 000€ - SIRET: 123 456 789 00012 - TVA: FR12345678901
          </p>
        </div>
      `
    }
    content += '</div>'
  }
  
  return content
}
</script>