<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] m-4 overflow-y-auto">
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Créer une nouvelle facture</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Informations client -->
        <div>
          <h3 class="text-md font-medium text-gray-900 dark:text-white mb-4">Informations client</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Client *
              </label>
              <input
                v-model="formData.client"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                placeholder="Nom du client"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date de facture *
              </label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse client *
            </label>
            <textarea
              v-model="formData.clientAddress"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
              placeholder="Adresse complète du client"
            ></textarea>
          </div>
        </div>

        <!-- Articles -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-md font-medium text-gray-900 dark:text-white">Articles</h3>
            <button
              type="button"
              @click="addItem"
              class="px-3 py-1 bg-sage-blue-600 text-white rounded text-sm hover:bg-sage-blue-700 transition-colors"
            >
              <Plus class="w-4 h-4 inline mr-1" />
              Ajouter
            </button>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="(item, index) in formData.items"
              :key="index"
              class="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="md:col-span-2">
                <input
                  v-model="item.description"
                  type="text"
                  placeholder="Description"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                />
              </div>
              <div>
                <input
                  v-model="item.quantity"
                  type="number"
                  placeholder="Qté"
                  min="1"
                  @input="calculateItemTotal(index)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                />
              </div>
              <div>
                <input
                  v-model="item.unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="Prix unit."
                  @input="calculateItemTotal(index)"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
                />
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(item.total || 0) }}
                </span>
                <button
                  type="button"
                  @click="removeItem(index)"
                  class="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Totaux -->
        <div class="flex justify-end">
          <div class="w-64 space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div class="flex justify-between text-sm">
              <span>Total HT:</span>
              <span class="font-medium">{{ formatCurrency(totals.amountHT) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span>TVA (20%):</span>
              <span class="font-medium">{{ formatCurrency(totals.tva) }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2">
              <span class="font-bold">Total TTC:</span>
              <span class="font-bold text-lg text-sage-blue-700 dark:text-sage-blue-400">
                {{ formatCurrency(totals.amountTTC) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 text-sm text-white bg-sage-blue-700 rounded hover:bg-sage-blue-800 transition-colors"
          >
            Créer la facture
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, Plus, Trash2 } from 'lucide-vue-next'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  client: '',
  clientAddress: '',
  date: new Date().toISOString().split('T')[0],
  items: [
    { description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]
})

const totals = computed(() => {
  const amountHT = formData.value.items.reduce((sum, item) => sum + (item.total || 0), 0)
  const tva = amountHT * 0.20
  const amountTTC = amountHT + tva
  
  return { amountHT, tva, amountTTC }
})

const addItem = () => {
  formData.value.items.push({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  })
}

const removeItem = (index) => {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1)
  }
}

const calculateItemTotal = (index) => {
  const item = formData.value.items[index]
  item.total = (item.quantity || 0) * (item.unitPrice || 0)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const handleSubmit = () => {
  // Calculer la date d'échéance (30 jours)
  const dueDate = new Date(formData.value.date)
  dueDate.setDate(dueDate.getDate() + 30)

  const invoiceData = {
    ...formData.value,
    dueDate: dueDate.toISOString().split('T')[0],
    amountHT: totals.value.amountHT,
    amountTTC: totals.value.amountTTC,
    tva: totals.value.tva
  }

  emit('save', invoiceData)
}
</script>