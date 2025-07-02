<template>
  <div 
    :class="`invoice-preview ${mode === 'print' ? 'print-mode' : 'desktop-mode'}`"
    :style="{
      fontFamily: template.fields.styling.fontFamily,
      fontSize: template.fields.styling.fontSize,
      color: '#374151'
    }"
  >
    <!-- En-tête -->
    <div v-if="template.fields.header.showCompanyInfo || template.fields.header.showLogo" class="header mb-8">
      <div class="flex items-start justify-between">
        <!-- Logo et informations entreprise -->
        <div :class="`flex items-start space-x-4 ${
          template.fields.header.logoPosition === 'center' ? 'mx-auto' : 
          template.fields.header.logoPosition === 'right' ? 'ml-auto' : ''
        }`">
          <div v-if="template.fields.header.showLogo" class="logo">
            <div 
              class="w-16 h-16 rounded flex items-center justify-center text-white font-bold text-xl"
              :style="{ backgroundColor: template.fields.styling.primaryColor }"
            >
              S
            </div>
          </div>
          <div v-if="template.fields.header.showCompanyInfo" class="company-info">
            <h1 class="text-2xl font-bold" :style="{ color: template.fields.styling.primaryColor }">
              Sage X3 Galvanoplastie
            </h1>
            <div class="text-sm text-gray-600 mt-2">
              <p>123 Rue de l'Industrie</p>
              <p>69000 Lyon, France</p>
              <p>Tél: +33 4 72 00 00 00</p>
              <p>Email: contact@sage-galvano.fr</p>
              <p>SIRET: 123 456 789 00012</p>
            </div>
          </div>
        </div>

        <!-- Titre facture -->
        <div v-if="template.fields.header.showInvoiceTitle" class="invoice-title">
          <h2 
            class="text-3xl font-bold"
            :style="{ color: template.fields.styling.primaryColor }"
          >
            FACTURE
          </h2>
        </div>
      </div>
    </div>

    <!-- Informations facture et client -->
    <div class="invoice-details mb-8">
      <div class="grid grid-cols-2 gap-8">
        <!-- Informations client -->
        <div v-if="template.fields.client.showClientAddress" 
             :class="`client-info ${template.fields.client.addressPosition === 'right' ? 'order-2' : 'order-1'}`">
          <h3 class="font-semibold mb-2" :style="{ color: template.fields.styling.primaryColor }">
            Facturé à:
          </h3>
          <div class="text-sm">
            <p class="font-medium">{{ invoice.client }}</p>
            <div class="whitespace-pre-line text-gray-600">{{ invoice.clientAddress }}</div>
          </div>
        </div>

        <!-- Informations facture -->
        <div :class="`invoice-info ${template.fields.client.addressPosition === 'right' ? 'order-1' : 'order-2'}`">
          <div class="space-y-2 text-sm">
            <div v-if="template.fields.invoice.showInvoiceNumber" class="flex justify-between">
              <span class="font-medium">Numéro:</span>
              <span>{{ invoice.number }}</span>
            </div>
            <div v-if="template.fields.invoice.showInvoiceDate" class="flex justify-between">
              <span class="font-medium">Date:</span>
              <span>{{ formatDate(invoice.date) }}</span>
            </div>
            <div v-if="template.fields.invoice.showDueDate" class="flex justify-between">
              <span class="font-medium">Échéance:</span>
              <span>{{ formatDate(invoice.dueDate) }}</span>
            </div>
            <div v-if="template.fields.invoice.showPaymentTerms" class="flex justify-between">
              <span class="font-medium">Conditions:</span>
              <span>30 jours net</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des articles -->
    <div class="items-table mb-8">
      <table class="w-full border-collapse">
        <thead>
          <tr :style="{ backgroundColor: template.fields.styling.secondaryColor }">
            <th v-if="template.fields.items.showDescription" 
                class="border border-gray-300 px-3 py-2 text-left font-medium">
              Description
            </th>
            <th v-if="template.fields.items.showQuantity" 
                class="border border-gray-300 px-3 py-2 text-center font-medium w-20">
              Qté
            </th>
            <th v-if="template.fields.items.showUnitPrice" 
                class="border border-gray-300 px-3 py-2 text-right font-medium w-24">
              Prix unit.
            </th>
            <th v-if="template.fields.items.showTotal" 
                class="border border-gray-300 px-3 py-2 text-right font-medium w-24">
              Total HT
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.description">
            <td v-if="template.fields.items.showDescription" 
                class="border border-gray-300 px-3 py-2">
              {{ item.description }}
            </td>
            <td v-if="template.fields.items.showQuantity" 
                class="border border-gray-300 px-3 py-2 text-center">
              {{ item.quantity }}
            </td>
            <td v-if="template.fields.items.showUnitPrice" 
                class="border border-gray-300 px-3 py-2 text-right">
              {{ formatCurrency(item.unitPrice) }}
            </td>
            <td v-if="template.fields.items.showTotal" 
                class="border border-gray-300 px-3 py-2 text-right font-medium">
              {{ formatCurrency(item.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totaux -->
    <div class="totals mb-8">
      <div class="flex justify-end">
        <div class="w-64 space-y-2">
          <div class="flex justify-between">
            <span>Total HT:</span>
            <span class="font-medium">{{ formatCurrency(invoice.amountHT) }}</span>
          </div>
          <div v-if="template.fields.items.showTVA" class="flex justify-between">
            <span>TVA (20%):</span>
            <span class="font-medium">{{ formatCurrency(invoice.tva) }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-300 pt-2">
            <span class="font-bold">Total TTC:</span>
            <span class="font-bold text-lg" :style="{ color: template.fields.styling.primaryColor }">
              {{ formatCurrency(invoice.amountTTC) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Pied de page -->
    <div v-if="template.fields.footer.showPaymentInfo || template.fields.footer.showLegalMentions || template.fields.footer.showSignature" 
         class="footer">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Informations de paiement -->
        <div v-if="template.fields.footer.showPaymentInfo">
          <h4 class="font-semibold mb-2" :style="{ color: template.fields.styling.primaryColor }">
            Informations de paiement
          </h4>
          <div class="text-sm text-gray-600">
            <p>Banque: Crédit Lyonnais</p>
            <p>IBAN: FR76 3000 3000 1100 0000 1234 567</p>
            <p>BIC: CCFRFRPP</p>
          </div>
        </div>

        <!-- Zone de signature -->
        <div v-if="template.fields.footer.showSignature">
          <h4 class="font-semibold mb-2" :style="{ color: template.fields.styling.primaryColor }">
            Signature
          </h4>
          <div class="h-16 border-b border-gray-300 mt-8"></div>
          <p class="text-sm text-gray-600 mt-2">Signature et cachet</p>
        </div>
      </div>

      <!-- Mentions légales -->
      <div v-if="template.fields.footer.showLegalMentions" class="legal-mentions mt-8 pt-4 border-t border-gray-300">
        <p class="text-xs text-gray-500 text-center">
          Sage X3 Galvanoplastie - SAS au capital de 100 000€ - SIRET: 123 456 789 00012 - 
          TVA: FR12345678901 - Code APE: 2561Z
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  template: Object,
  invoice: Object,
  mode: {
    type: String,
    default: 'desktop'
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<style scoped>
.invoice-preview {
  @apply bg-white;
}

.print-mode {
  @apply text-xs;
}

.desktop-mode {
  @apply text-sm;
}

.invoice-preview table {
  border-collapse: collapse;
}

.invoice-preview th,
.invoice-preview td {
  @apply text-sm;
}

.print-mode th,
.print-mode td {
  @apply text-xs;
}
</style>