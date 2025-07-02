<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-40">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Gestion des Factures</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ filteredInvoices.length }} facture(s) sur {{ totalInvoices }} enregistrement(s)
          </p>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="showTemplateManager = true"
            class="px-3 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            <Settings class="w-4 h-4 inline mr-1" />
            Modèles d'impression
          </button>
          <button
            @click="showCreateInvoice = true"
            class="px-3 py-2 text-sm bg-sage-blue-700 text-white rounded hover:bg-sage-blue-800 transition-colors"
          >
            <Plus class="w-4 h-4 inline mr-1" />
            Nouvelle facture
          </button>
          <button
            @click="refreshData"
            class="px-3 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <RefreshCw class="w-4 h-4 inline mr-1" />
            Actualiser
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher une facture..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
          />
        </div>
        
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="sent">Envoyée</option>
          <option value="paid">Payée</option>
          <option value="overdue">En retard</option>
          <option value="cancelled">Annulée</option>
        </select>

        <select
          v-model="clientFilter"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
        >
          <option value="">Tous les clients</option>
          <option v-for="client in uniqueClients" :key="client" :value="client">
            {{ client }}
          </option>
        </select>

        <input
          v-model="dateFilter"
          type="month"
          class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
        />
      </div>
    </div>

    <!-- Invoice List -->
    <div class="p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Numéro
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Échéance
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Montant HT
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Montant TTC
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Statut
                </th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="invoice in paginatedInvoices"
                :key="invoice.id"
                @click="selectInvoice(invoice)"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                  {{ invoice.number }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">
                  {{ invoice.client }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(invoice.date) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(invoice.dueDate) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">
                  {{ formatCurrency(invoice.amountHT) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-semibold">
                  {{ formatCurrency(invoice.amountTTC) }}
                </td>
                <td class="px-4 py-3">
                  <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(invoice.status)}`">
                    {{ getStatusLabel(invoice.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center space-x-2">
                    <button
                      @click.stop="viewInvoice(invoice)"
                      class="text-gray-400 hover:text-sage-blue-600 transition-colors"
                      title="Voir"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="editInvoice(invoice)"
                      class="text-gray-400 hover:text-sage-blue-600 transition-colors"
                      title="Modifier"
                    >
                      <Edit class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="showPrintOptions(invoice)"
                      class="text-gray-400 hover:text-purple-600 transition-colors"
                      title="Imprimer"
                    >
                      <Printer class="w-4 h-4" />
                    </button>
                    <button
                      @click.stop="deleteInvoice(invoice)"
                      class="text-gray-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700 dark:text-gray-300">
              Affichage de {{ startRecord }} à {{ endRecord }} sur {{ filteredInvoices.length }} résultats
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Précédent
              </button>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                Page {{ currentPage }} sur {{ totalPages }}
              </span>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <InvoiceDetailModal
      :is-open="showInvoiceDetail"
      :invoice="selectedInvoice"
      @close="showInvoiceDetail = false"
      @edit="editInvoice"
      @print="showPrintOptions"
    />

    <CreateInvoiceModal
      :is-open="showCreateInvoice"
      @close="showCreateInvoice = false"
      @save="handleCreateInvoice"
    />

    <GenericPrintModal
      :is-open="showPrintModal"
      :document-type="invoiceDocumentType"
      :document-data="selectedInvoice"
      :templates="printTemplates"
      @close="showPrintModal = false"
      @print="handlePrint"
    />

    <PrintTemplateManager
      :is-open="showTemplateManager"
      :templates="printTemplates"
      @close="showTemplateManager = false"
      @save="handleSaveTemplate"
      @delete="handleDeleteTemplate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search, Plus, RefreshCw, Settings, Eye, Edit, Printer, Trash2
} from 'lucide-vue-next'
import InvoiceDetailModal from './InvoiceDetailModal.vue'
import CreateInvoiceModal from './CreateInvoiceModal.vue'
import GenericPrintModal from './GenericPrintModal.vue'
import PrintTemplateManager from './PrintTemplateManager.vue'

// État du composant
const searchTerm = ref('')
const statusFilter = ref('')
const clientFilter = ref('')
const dateFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedInvoice = ref(null)

// Modals
const showInvoiceDetail = ref(false)
const showCreateInvoice = ref(false)
const showPrintModal = ref(false)
const showTemplateManager = ref(false)

// Type de document pour les factures
const invoiceDocumentType = ref({
  id: 'invoice',
  name: 'Factures',
  description: 'Factures de vente et d\'achat'
})

// Données des factures
const invoices = ref([
  {
    id: 'INV-2024-001',
    number: 'FAC-2024-001',
    client: 'ACME Corporation',
    clientAddress: '123 Rue de la Paix, 75001 Paris',
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amountHT: 1250.00,
    amountTTC: 1500.00,
    tva: 250.00,
    status: 'sent',
    items: [
      { description: 'Traitement galvanoplastie - Lot #001', quantity: 100, unitPrice: 10.00, total: 1000.00 },
      { description: 'Contrôle qualité', quantity: 1, unitPrice: 250.00, total: 250.00 }
    ]
  },
  {
    id: 'INV-2024-002',
    number: 'FAC-2024-002',
    client: 'TechnoPlast SAS',
    clientAddress: '456 Avenue des Champs, 69000 Lyon',
    date: '2024-01-18',
    dueDate: '2024-02-18',
    amountHT: 2100.00,
    amountTTC: 2520.00,
    tva: 420.00,
    status: 'paid',
    items: [
      { description: 'Nickelage brillant - Série A', quantity: 200, unitPrice: 8.50, total: 1700.00 },
      { description: 'Chromage décoratif', quantity: 50, unitPrice: 8.00, total: 400.00 }
    ]
  },
  {
    id: 'INV-2024-003',
    number: 'FAC-2024-003',
    client: 'MetalWorks Industries',
    clientAddress: '789 Boulevard Industriel, 13000 Marseille',
    date: '2024-01-20',
    dueDate: '2024-02-20',
    amountHT: 3200.00,
    amountTTC: 3840.00,
    tva: 640.00,
    status: 'overdue',
    items: [
      { description: 'Zingage électrolytique', quantity: 500, unitPrice: 5.20, total: 2600.00 },
      { description: 'Passivation', quantity: 500, unitPrice: 1.20, total: 600.00 }
    ]
  },
  {
    id: 'INV-2024-004',
    number: 'FAC-2024-004',
    client: 'Precision Parts Ltd',
    clientAddress: '321 Industrial Park, 59000 Lille',
    date: '2024-01-22',
    dueDate: '2024-02-22',
    amountHT: 875.00,
    amountTTC: 1050.00,
    tva: 175.00,
    status: 'draft',
    items: [
      { description: 'Cuivrage décoratif', quantity: 75, unitPrice: 11.67, total: 875.00 }
    ]
  }
])

// Modèles d'impression
const printTemplates = ref([
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
  }
])

// Computed properties
const totalInvoices = computed(() => invoices.value.length)

const uniqueClients = computed(() => {
  return [...new Set(invoices.value.map(inv => inv.client))]
})

const filteredInvoices = computed(() => {
  let filtered = [...invoices.value]

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase()
    filtered = filtered.filter(inv =>
      inv.number.toLowerCase().includes(search) ||
      inv.client.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(inv => inv.status === statusFilter.value)
  }

  if (clientFilter.value) {
    filtered = filtered.filter(inv => inv.client === clientFilter.value)
  }

  if (dateFilter.value) {
    const [year, month] = dateFilter.value.split('-')
    filtered = filtered.filter(inv => {
      const invDate = new Date(inv.date)
      return invDate.getFullYear() === parseInt(year) && 
             invDate.getMonth() === parseInt(month) - 1
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredInvoices.value.length / pageSize.value))

const paginatedInvoices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredInvoices.value.slice(start, start + pageSize.value)
})

const startRecord = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1
})

const endRecord = computed(() => {
  return Math.min(currentPage.value * pageSize.value, filteredInvoices.value.length)
})

// Méthodes
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const getStatusStyle = (status) => {
  const styles = {
    draft: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
  return styles[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    sent: 'Envoyée',
    paid: 'Payée',
    overdue: 'En retard',
    cancelled: 'Annulée'
  }
  return labels[status] || status
}

const selectInvoice = (invoice) => {
  selectedInvoice.value = invoice
  showInvoiceDetail.value = true
}

const viewInvoice = (invoice) => {
  selectedInvoice.value = invoice
  showInvoiceDetail.value = true
}

const editInvoice = (invoice) => {
  selectedInvoice.value = invoice
  // Ouvrir modal d'édition
  console.log('Edit invoice:', invoice)
}

const showPrintOptions = (invoice) => {
  selectedInvoice.value = invoice
  showPrintModal.value = true
}

const deleteInvoice = (invoice) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la facture ${invoice.number} ?`)) {
    const index = invoices.value.findIndex(inv => inv.id === invoice.id)
    if (index > -1) {
      invoices.value.splice(index, 1)
    }
  }
}

const handleCreateInvoice = (invoiceData) => {
  const newInvoice = {
    id: `INV-${Date.now()}`,
    number: `FAC-2024-${String(invoices.value.length + 1).padStart(3, '0')}`,
    ...invoiceData,
    status: 'draft'
  }
  invoices.value.push(newInvoice)
  showCreateInvoice.value = false
}

const handlePrint = (printConfig) => {
  console.log('Printing invoice with config:', printConfig)
  // Logique d'impression avec le modèle configuré
  showPrintModal.value = false
}

const handleSaveTemplate = (template) => {
  const index = printTemplates.value.findIndex(t => t.id === template.id)
  if (index > -1) {
    printTemplates.value[index] = template
  } else {
    printTemplates.value.push(template)
  }
}

const handleDeleteTemplate = (templateId) => {
  const index = printTemplates.value.findIndex(t => t.id === templateId)
  if (index > -1) {
    printTemplates.value.splice(index, 1)
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const refreshData = () => {
  // Logique de rafraîchissement
  console.log('Refreshing invoice data...')
}

onMounted(() => {
  // Initialisation
})
</script>