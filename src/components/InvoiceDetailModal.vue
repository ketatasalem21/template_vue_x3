<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] m-4 overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          Détails de la facture {{ invoice?.number }}
        </h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div v-if="invoice" class="p-6 space-y-6">
        <!-- En-tête avec statut -->
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ invoice.number }}</h3>
            <p class="text-gray-600 dark:text-gray-400">{{ invoice.client }}</p>
          </div>
          <span :class="`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(invoice.status)}`">
            {{ getStatusLabel(invoice.status) }}
          </span>
        </div>

        <!-- Informations principales -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Informations client</h4>
            <div class="space-y-2 text-sm">
              <div><span class="font-medium">Nom:</span> {{ invoice.client }}</div>
              <div><span class="font-medium">Adresse:</span></div>
              <div class="whitespace-pre-line text-gray-600 dark:text-gray-400 ml-4">{{ invoice.clientAddress }}</div>
            </div>
          </div>
          
          <div>
            <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Informations facture</h4>
            <div class="space-y-2 text-sm">
              <div><span class="font-medium">Date:</span> {{ formatDate(invoice.date) }}</div>
              <div><span class="font-medium">Échéance:</span> {{ formatDate(invoice.dueDate) }}</div>
              <div><span class="font-medium">Conditions:</span> 30 jours net</div>
            </div>
          </div>
        </div>

        <!-- Articles -->
        <div>
          <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">Articles facturés</h4>
          <div class="overflow-x-auto">
            <table class="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Quantité
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Prix unitaire
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
                <tr v-for="item in invoice.items" :key="item.description">
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-white">{{ item.description }}</td>
                  <td class="px-4 py-3 text-sm text-center text-gray-900 dark:text-white">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-right text-gray-900 dark:text-white">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="px-4 py-3 text-sm text-right font-medium text-gray-900 dark:text-white">{{ formatCurrency(item.total) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totaux -->
        <div class="flex justify-end">
          <div class="w-64 space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between text-sm">
              <span>Total HT:</span>
              <span class="font-medium">{{ formatCurrency(invoice.amountHT) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>TVA (20%):</span>
              <span class="font-medium">{{ formatCurrency(invoice.tva) }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2">
              <span class="font-bold">Total TTC:</span>
              <span class="font-bold text-lg text-sage-blue-700 dark:text-sage-blue-400">
                {{ formatCurrency(invoice.amountTTC) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="$emit('edit', invoice)"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            <Edit class="w-4 h-4 inline mr-1" />
            Modifier
          </button>
          <button
            @click="$emit('print', invoice)"
            class="px-4 py-2 text-sm text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
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
import { X, Edit, Printer } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  invoice: Object
})

defineEmits(['close', 'edit', 'print'])

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
</script>