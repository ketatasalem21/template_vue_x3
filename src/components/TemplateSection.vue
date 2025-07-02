<template>
  <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
    <h5 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
      <component :is="icon" class="w-4 h-4 mr-2" />
      {{ title }}
    </h5>
    <div class="space-y-3">
      <label
        v-for="(value, key) in fields"
        :key="key"
        class="flex items-center space-x-2"
      >
        <input
          :checked="value"
          @change="updateField(key, $event.target.checked)"
          type="checkbox"
          class="w-4 h-4 text-purple-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300">{{ getFieldLabel(key) }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  icon: Object,
  fields: Object
})

const emit = defineEmits(['update'])

const updateField = (fieldKey, value) => {
  const updatedFields = { ...props.fields }
  updatedFields[fieldKey] = value
  emit('update', updatedFields)
}

const getFieldLabel = (key) => {
  const labels = {
    // En-tête
    showLogo: 'Afficher le logo',
    showCompanyInfo: 'Informations entreprise',
    showTitle: 'Titre du document',
    logoPosition: 'Position du logo',
    
    // Informations principales
    showNumber: 'Numéro du document',
    showDate: 'Date',
    showDueDate: 'Date d\'échéance',
    showDeliveryDate: 'Date de livraison',
    showClient: 'Client',
    showClientAddress: 'Adresse client',
    showSupplier: 'Fournisseur',
    showSupplierAddress: 'Adresse fournisseur',
    
    // Tableau
    showDescription: 'Description',
    showQuantity: 'Quantité',
    showUnitPrice: 'Prix unitaire',
    showTotal: 'Total',
    showReference: 'Référence',
    
    // Totaux
    showSubtotal: 'Sous-total',
    showTax: 'TVA',
    showDiscount: 'Remise',
    
    // Pied de page
    showPaymentInfo: 'Informations de paiement',
    showLegalMentions: 'Mentions légales',
    showSignature: 'Zone de signature',
    showTerms: 'Conditions générales'
  }
  return labels[key] || key
}
</script>