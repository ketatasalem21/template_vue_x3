<template>
  <div 
    :class="`document-preview ${mode === 'print' ? 'print-mode' : 'desktop-mode'}`"
    :style="{
      fontFamily: template.styling.fontFamily,
      fontSize: template.styling.fontSize,
      color: '#374151'
    }"
  >
    <!-- En-tête -->
    <div v-if="shouldShowSection('header')" class="header mb-8">
      <div class="flex items-start justify-between">
        <!-- Logo et informations entreprise -->
        <div :class="`flex items-start space-x-4 ${
          template.sections.header.logoPosition === 'center' ? 'mx-auto' : 
          template.sections.header.logoPosition === 'right' ? 'ml-auto' : ''
        }`">
          <div v-if="template.sections.header.showLogo" class="logo">
            <div 
              class="w-16 h-16 rounded flex items-center justify-center text-white font-bold text-xl"
              :style="{ backgroundColor: template.styling.primaryColor }"
            >
              S
            </div>
          </div>
          <div v-if="template.sections.header.showCompanyInfo" class="company-info">
            <h1 class="text-2xl font-bold" :style="{ color: template.styling.primaryColor }">
              Sage X3 {{ getDocumentTypeName() }}
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

        <!-- Titre du document -->
        <div v-if="template.sections.header.showTitle" class="document-title">
          <h2 
            class="text-3xl font-bold"
            :style="{ color: template.styling.primaryColor }"
          >
            {{ getDocumentTitle() }}
          </h2>
        </div>
      </div>
    </div>

    <!-- Informations principales -->
    <div v-if="shouldShowSection('main')" class="main-info mb-8">
      <div class="grid grid-cols-2 gap-8">
        <!-- Informations destinataire -->
        <div v-if="shouldShowDestinationInfo()" class="destination-info">
          <h3 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            {{ getDestinationLabel() }}:
          </h3>
          <div class="text-sm">
            <p class="font-medium">{{ getDestinationName() }}</p>
            <div v-if="shouldShowDestinationAddress()" class="whitespace-pre-line text-gray-600">
              {{ getDestinationAddress() }}
            </div>
          </div>
        </div>

        <!-- Informations document -->
        <div class="document-info">
          <div class="space-y-2 text-sm">
            <div v-if="template.sections.main.showNumber" class="flex justify-between">
              <span class="font-medium">Numéro:</span>
              <span>{{ sampleData.number || 'DOC-2024-001' }}</span>
            </div>
            <div v-if="template.sections.main.showDate" class="flex justify-between">
              <span class="font-medium">Date:</span>
              <span>{{ formatDate(sampleData.date) || '15/01/2024' }}</span>
            </div>
            <div v-if="template.sections.main.showDueDate && sampleData.dueDate" class="flex justify-between">
              <span class="font-medium">Échéance:</span>
              <span>{{ formatDate(sampleData.dueDate) }}</span>
            </div>
            <div v-if="template.sections.main.showDeliveryDate && sampleData.deliveryDate" class="flex justify-between">
              <span class="font-medium">Livraison:</span>
              <span>{{ formatDate(sampleData.deliveryDate) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau des éléments -->
    <div v-if="shouldShowSection('table') && sampleData.items" class="items-table mb-8">
      <table class="w-full border-collapse">
        <thead>
          <tr :style="{ backgroundColor: template.styling.secondaryColor }">
            <th v-if="template.sections.table.showDescription" 
                class="border border-gray-300 px-3 py-2 text-left font-medium">
              Description
            </th>
            <th v-if="template.sections.table.showQuantity" 
                class="border border-gray-300 px-3 py-2 text-center font-medium w-20">
              Qté
            </th>
            <th v-if="template.sections.table.showUnitPrice" 
                class="border border-gray-300 px-3 py-2 text-right font-medium w-24">
              Prix unit.
            </th>
            <th v-if="template.sections.table.showTotal" 
                class="border border-gray-300 px-3 py-2 text-right font-medium w-24">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sampleData.items" :key="item.description">
            <td v-if="template.sections.table.showDescription" 
                class="border border-gray-300 px-3 py-2">
              {{ item.description }}
            </td>
            <td v-if="template.sections.table.showQuantity" 
                class="border border-gray-300 px-3 py-2 text-center">
              {{ item.quantity }}
            </td>
            <td v-if="template.sections.table.showUnitPrice" 
                class="border border-gray-300 px-3 py-2 text-right">
              {{ formatCurrency(item.unitPrice) }}
            </td>
            <td v-if="template.sections.table.showTotal" 
                class="border border-gray-300 px-3 py-2 text-right font-medium">
              {{ formatCurrency(item.total) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totaux -->
    <div v-if="shouldShowSection('totals') && hasFinancialData()" class="totals mb-8">
      <div class="flex justify-end">
        <div class="w-64 space-y-2">
          <div v-if="template.sections.totals.showSubtotal" class="flex justify-between">
            <span>Sous-total:</span>
            <span class="font-medium">{{ formatCurrency(sampleData.subtotal) }}</span>
          </div>
          <div v-if="template.sections.totals.showDiscount && sampleData.discount" class="flex justify-between">
            <span>Remise:</span>
            <span class="font-medium">{{ formatCurrency(sampleData.discount) }}</span>
          </div>
          <div v-if="template.sections.totals.showTax && sampleData.tax" class="flex justify-between">
            <span>TVA:</span>
            <span class="font-medium">{{ formatCurrency(sampleData.tax) }}</span>
          </div>
          <div v-if="template.sections.totals.showTotal" class="flex justify-between border-t border-gray-300 pt-2">
            <span class="font-bold">Total:</span>
            <span class="font-bold text-lg" :style="{ color: template.styling.primaryColor }">
              {{ formatCurrency(sampleData.total) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu spécialisé pour fiches techniques -->
    <div v-if="documentType.id === 'technical_sheet'" class="technical-content mb-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-if="sampleData.specifications">
          <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            Spécifications techniques
          </h4>
          <div class="text-sm whitespace-pre-line text-gray-700">
            {{ sampleData.specifications }}
          </div>
        </div>
        <div v-if="sampleData.materials">
          <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            Matériaux
          </h4>
          <div class="text-sm text-gray-700">
            {{ sampleData.materials }}
          </div>
        </div>
      </div>
      <div v-if="sampleData.instructions" class="mt-6">
        <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
          Instructions
        </h4>
        <div class="text-sm text-gray-700">
          {{ sampleData.instructions }}
        </div>
      </div>
    </div>

    <!-- Pied de page -->
    <div v-if="shouldShowSection('footer')" class="footer">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Informations de paiement -->
        <div v-if="template.sections.footer.showPaymentInfo">
          <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            Informations de paiement
          </h4>
          <div class="text-sm text-gray-600">
            <p>Banque: Crédit Lyonnais</p>
            <p>IBAN: FR76 3000 3000 1100 0000 1234 567</p>
            <p>BIC: CCFRFRPP</p>
          </div>
        </div>

        <!-- Conditions générales -->
        <div v-if="template.sections.footer.showTerms">
          <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            Conditions
          </h4>
          <div class="text-sm text-gray-600">
            <p>Paiement à 30 jours</p>
            <p>Livraison franco de port</p>
          </div>
        </div>

        <!-- Zone de signature -->
        <div v-if="template.sections.footer.showSignature">
          <h4 class="font-semibold mb-2" :style="{ color: template.styling.primaryColor }">
            Signature
          </h4>
          <div class="h-16 border-b border-gray-300 mt-8"></div>
          <p class="text-sm text-gray-600 mt-2">Signature et cachet</p>
        </div>
      </div>

      <!-- Mentions légales -->
      <div v-if="template.sections.footer.showLegalMentions" class="legal-mentions mt-8 pt-4 border-t border-gray-300">
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
  documentType: Object,
  sampleData: Object,
  mode: {
    type: String,
    default: 'desktop'
  }
})

const shouldShowSection = (sectionName) => {
  return props.template.sections[sectionName] && 
         Object.values(props.template.sections[sectionName]).some(value => value === true)
}

const shouldShowDestinationInfo = () => {
  return props.template.sections.main.showClient || 
         props.template.sections.main.showSupplier
}

const shouldShowDestinationAddress = () => {
  return props.template.sections.main.showClientAddress || 
         props.template.sections.main.showSupplierAddress
}

const getDocumentTypeName = () => {
  return props.documentType?.name || 'Document'
}

const getDocumentTitle = () => {
  const titles = {
    invoice: 'FACTURE',
    order: 'BON DE COMMANDE',
    delivery: 'BON DE LIVRAISON',
    quote: 'DEVIS',
    receipt: 'REÇU',
    technical_sheet: 'FICHE TECHNIQUE',
    inventory: 'INVENTAIRE',
    report: 'RAPPORT',
    contact_sheet: 'FICHE CONTACT'
  }
  return titles[props.documentType?.id] || 'DOCUMENT'
}

const getDestinationLabel = () => {
  if (props.template.sections.main.showClient) return 'Facturé à'
  if (props.template.sections.main.showSupplier) return 'Fournisseur'
  return 'Destinataire'
}

const getDestinationName = () => {
  return props.sampleData.client || props.sampleData.supplier || 'Nom du destinataire'
}

const getDestinationAddress = () => {
  return props.sampleData.clientAddress || props.sampleData.supplierAddress || 'Adresse du destinataire'
}

const hasFinancialData = () => {
  return props.sampleData.subtotal || props.sampleData.total || props.sampleData.tax
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatCurrency = (amount) => {
  if (!amount) return '0,00 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
</script>

<style scoped>
.document-preview {
  @apply bg-white;
}

.print-mode {
  @apply text-xs;
}

.desktop-mode {
  @apply text-sm;
}

.document-preview table {
  border-collapse: collapse;
}

.document-preview th,
.document-preview td {
  @apply text-sm;
}

.print-mode th,
.print-mode td {
  @apply text-xs;
}
</style>