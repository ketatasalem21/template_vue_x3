<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      class="bg-white dark:bg-gray-800 shadow-xl overflow-hidden
        w-full h-full m-0 rounded-none
        sm:rounded-lg sm:max-w-6xl sm:max-h-[90vh] sm:m-4"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-purple-700">
        <div class="flex items-center space-x-3">
          <Settings class="w-6 h-6 text-white" />
          <h2 class="text-xl font-semibold text-white">Configuration des Modèles d'Impression</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-col sm:flex-row h-[calc(100vh-64px)] sm:h-[calc(90vh-80px)]">
        <!-- Sidebar - Liste des modèles -->
        <div class="w-full sm:w-80 bg-gray-50 dark:bg-gray-900 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div class="p-3 sm:p-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Modèles</h3>
              <button
                @click="createNewTemplate"
                class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                <Plus class="w-4 h-4 inline mr-1" />
                Nouveau
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="template in templates"
                :key="template.id"
                @click="selectTemplate(template)"
                :class="`p-3 rounded-lg cursor-pointer transition-colors border ${
                  selectedTemplate?.id === template.id
                    ? 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`"
              >
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="font-medium text-gray-900 dark:text-white">{{ template.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ template.description }}</div>
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
        </div>

        <!-- Configuration principale -->
        <div class="flex-1 flex flex-col sm:flex-row">
          <!-- Panneau de configuration -->
          <div class="w-full sm:w-96 bg-white dark:bg-gray-800 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div v-if="selectedTemplate" class="p-3 sm:p-4 space-y-6">
              <!-- Informations générales -->
              <div>
                <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nom du modèle
                    </label>
                    <input
                      v-model="selectedTemplate.name"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      v-model="selectedTemplate.description"
                      rows="2"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="selectedTemplate.isDefault"
                      type="checkbox"
                      class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label class="text-sm text-gray-700 dark:text-gray-300">
                      Définir comme modèle par défaut
                    </label>
                  </div>
                </div>
              </div>

              <!-- Configuration des sections -->
              <div class="space-y-4">
                <!-- En-tête -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText class="w-4 h-4 mr-2" />
                    En-tête
                  </h5>
                  <div class="space-y-3">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.header.showLogo"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Afficher le logo</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.header.showCompanyInfo"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Informations entreprise</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.header.showInvoiceTitle"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Titre "FACTURE"</span>
                    </label>
                    <div v-if="selectedTemplate.fields.header.showLogo">
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position du logo
                      </label>
                      <select
                        v-model="selectedTemplate.fields.header.logoPosition"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Client -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <User class="w-4 h-4 mr-2" />
                    Informations client
                  </h5>
                  <div class="space-y-3">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.client.showClientAddress"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Adresse client</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.client.showClientContact"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Contact client</span>
                    </label>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Position adresse
                      </label>
                      <select
                        v-model="selectedTemplate.fields.client.addressPosition"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Facture -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText class="w-4 h-4 mr-2" />
                    Informations facture
                  </h5>
                  <div class="space-y-3">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.invoice.showInvoiceNumber"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Numéro de facture</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.invoice.showInvoiceDate"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Date de facture</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.invoice.showDueDate"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Date d'échéance</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.invoice.showPaymentTerms"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Conditions de paiement</span>
                    </label>
                  </div>
                </div>

                <!-- Articles -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <Package class="w-4 h-4 mr-2" />
                    Lignes d'articles
                  </h5>
                  <div class="space-y-3">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.items.showDescription"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Description</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.items.showQuantity"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Quantité</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.items.showUnitPrice"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Prix unitaire</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.items.showTotal"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Total</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.items.showTVA"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">TVA</span>
                    </label>
                  </div>
                </div>

                <!-- Pied de page -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
                  <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <FileText class="w-4 h-4 mr-2" />
                    Pied de page
                  </h5>
                  <div class="space-y-3">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.footer.showPaymentInfo"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Informations de paiement</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.footer.showLegalMentions"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Mentions légales</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="selectedTemplate.fields.footer.showSignature"
                        type="checkbox"
                        class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                      />
                      <span class="text-sm text-gray-700 dark:text-gray-300">Zone de signature</span>
                    </label>
                  </div>
                </div>

                <!-- Style -->
                <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-3 sm:p-4">
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
                        v-model="selectedTemplate.fields.styling.primaryColor"
                        type="color"
                        class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Couleur secondaire
                      </label>
                      <input
                        v-model="selectedTemplate.fields.styling.secondaryColor"
                        type="color"
                        class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Police
                      </label>
                      <select
                        v-model="selectedTemplate.fields.styling.fontFamily"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Taille de police
                      </label>
                      <select
                        v-model="selectedTemplate.fields.styling.fontSize"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      >
                        <option value="10px">10px</option>
                        <option value="11px">11px</option>
                        <option value="12px">12px</option>
                        <option value="14px">14px</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center text-gray-500 dark:text-gray-400">
              <FileText class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Sélectionnez un modèle pour le configurer</p>
            </div>
          </div>

          <!-- Aperçu -->
          <div class="flex-1 bg-gray-50 dark:bg-gray-900 p-3 sm:p-4 overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white">Aperçu</h4>
              <div class="flex items-center space-x-2">
                <button
                  @click="previewMode = 'desktop'"
                  :class="`px-3 py-1 text-sm rounded transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-purple-600 text-white'
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
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`"
                >
                  <Printer class="w-4 h-4 inline mr-1" />
                  Impression
                </button>
              </div>
            </div>

            <div v-if="selectedTemplate" class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
              <InvoicePreview
                :template="selectedTemplate"
                :invoice="sampleInvoice"
                :mode="previewMode"
              />
            </div>

            <div v-else class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center text-gray-500">
              <Eye class="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Sélectionnez un modèle pour voir l'aperçu</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer avec boutons d'action -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-4 sm:gap-0">
        <div class="text-sm text-gray-600 dark:text-gray-400">
          {{ templates.length }} modèle(s) configuré(s)
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
          <button
            @click="$emit('close')"
            class="w-full sm:w-auto px-6 py-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
          <button
            v-if="selectedTemplate"
            @click="saveTemplate"
            class="w-full sm:w-auto px-6 py-3 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save class="w-4 h-4 inline mr-2" />
            Enregistrer
          </button>
          <button
            v-if="selectedTemplate"
            @click="printTemplate"
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
import { ref, computed } from 'vue'
import {
  Settings, X, Plus, Star, Copy, Trash2, FileText, User, Package, Palette,
  Monitor, Printer, Eye, Save
} from 'lucide-vue-next'
import InvoicePreview from './InvoicePreview.vue'

const props = defineProps({
  isOpen: Boolean,
  templates: Array
})

const emit = defineEmits(['close', 'save', 'delete'])

const selectedTemplate = ref(null)
const previewMode = ref('desktop')

// Facture d'exemple pour l'aperçu
const sampleInvoice = ref({
  number: 'FAC-2024-001',
  client: 'ACME Corporation',
  clientAddress: '123 Rue de la Paix\n75001 Paris\nFrance',
  date: '2024-01-15',
  dueDate: '2024-02-15',
  amountHT: 1250.00,
  amountTTC: 1500.00,
  tva: 250.00,
  items: [
    { description: 'Traitement galvanoplastie - Lot #001', quantity: 100, unitPrice: 10.00, total: 1000.00 },
    { description: 'Contrôle qualité', quantity: 1, unitPrice: 250.00, total: 250.00 }
  ]
})

const selectTemplate = (template) => {
  selectedTemplate.value = { ...template }
}

const createNewTemplate = () => {
  const newTemplate = {
    id: `template-${Date.now()}`,
    name: 'Nouveau modèle',
    description: 'Description du nouveau modèle',
    isDefault: false,
    fields: {
      header: {
        showLogo: true,
        showCompanyInfo: true,
        showInvoiceTitle: true,
        logoPosition: 'left'
      },
      client: {
        showClientAddress: true,
        showClientContact: true,
        addressPosition: 'right'
      },
      invoice: {
        showInvoiceNumber: true,
        showInvoiceDate: true,
        showDueDate: true,
        showPaymentTerms: true
      },
      items: {
        showDescription: true,
        showQuantity: true,
        showUnitPrice: true,
        showTotal: true,
        showTVA: true
      },
      footer: {
        showPaymentInfo: true,
        showLegalMentions: true,
        showSignature: false
      },
      styling: {
        primaryColor: '#073a6f',
        secondaryColor: '#f3f4f6',
        fontFamily: 'Arial',
        fontSize: '12px'
      }
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

const saveTemplate = () => {
  if (selectedTemplate.value) {
    emit('save', selectedTemplate.value)
  }
}

const printTemplate = () => {
  if (selectedTemplate.value) {
    // Créer une configuration d'impression avec le modèle sélectionné
    const printConfig = {
      template: selectedTemplate.value,
      invoice: sampleInvoice.value,
      options: {
        copies: 1,
        paperSize: 'A4',
        orientation: 'portrait',
        quality: 'normal',
        color: 'color'
      }
    }
    
    // Ouvrir une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Impression - ${selectedTemplate.value.name}</title>
            <style>
              body { 
                font-family: ${selectedTemplate.value.fields.styling.fontFamily}; 
                font-size: ${selectedTemplate.value.fields.styling.fontSize};
                margin: 20px; 
                color: #374151;
              }
              .invoice-preview { max-width: 800px; margin: 0 auto; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: ${selectedTemplate.value.fields.styling.secondaryColor}; }
              .header { margin-bottom: 30px; }
              .company-info h1 { color: ${selectedTemplate.value.fields.styling.primaryColor}; }
              .invoice-title h2 { color: ${selectedTemplate.value.fields.styling.primaryColor}; }
              .total { font-weight: bold; color: ${selectedTemplate.value.fields.styling.primaryColor}; }
              @media print {
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="no-print" style="text-align: center; margin-bottom: 20px;">
              <button onclick="window.print()" style="background: rgb(7, 58, 111); color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">Imprimer</button>
              <button onclick="window.close()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">Fermer</button>
            </div>
            <div class="invoice-preview">
              <div class="header">
                <h1>Sage X3 Galvanoplastie</h1>
                <div class="invoice-title">
                  <h2>FACTURE</h2>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
                <div>
                  <h3>Facturé à:</h3>
                  <p><strong>${sampleInvoice.value.client}</strong></p>
                  <p>${sampleInvoice.value.clientAddress.replace(/\n/g, '<br>')}</p>
                </div>
                <div>
                  <p><strong>Numéro:</strong> ${sampleInvoice.value.number}</p>
                  <p><strong>Date:</strong> ${new Date(sampleInvoice.value.date).toLocaleDateString('fr-FR')}</p>
                  <p><strong>Échéance:</strong> ${new Date(sampleInvoice.value.dueDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Qté</th>
                    <th>Prix unit.</th>
                    <th>Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  ${sampleInvoice.value.items.map(item => `
                    <tr>
                      <td>${item.description}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unitPrice.toFixed(2)} €</td>
                      <td>${item.total.toFixed(2)} €</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="text-align: right; margin-top: 30px;">
                <p>Total HT: ${sampleInvoice.value.amountHT.toFixed(2)} €</p>
                <p>TVA (20%): ${sampleInvoice.value.tva.toFixed(2)} €</p>
                <p class="total" style="font-size: 1.2em;">Total TTC: ${sampleInvoice.value.amountTTC.toFixed(2)} €</p>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
    }
  }
}
</script>