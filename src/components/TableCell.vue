<template>
  <div class="relative">
    <!-- Input Text -->
    <input
      v-if="column.type === 'text'"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
      :placeholder="column.placeholder || ''"
    />

    <!-- Input Number -->
    <input
      v-else-if="column.type === 'number'"
      type="number"
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      step="0.000001"
      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
    />

    <!-- Input Currency -->
    <input
      v-else-if="column.type === 'currency'"
      type="text"
      :value="value"
      @input="handleCurrencyInput"
      @blur="handleBlur"
      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
      placeholder="0,00"
    />

    <!-- Input Date -->
    <div v-else-if="column.type === 'date'" class="relative">
      <input
        :value="value"
        @input="handleInput"
        @blur="handleBlur"
        @focus="showDatePicker = true"
        class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
        placeholder="DD/MM/YYYY"
        readonly
      />
      <Calendar class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      
      <!-- Date Picker Simple -->
      <div v-if="showDatePicker" class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-3">
        <input
          type="date"
          :value="getDateValue(value)"
          @change="handleDateChange"
          class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <div class="flex justify-end mt-2 space-x-2">
          <button
            @click="showDatePicker = false"
            class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Select -->
    <select
      v-else-if="column.type === 'select'"
      :value="value"
      @change="handleSelect"
      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
    >
      <option value="">Sélectionner...</option>
      <option
        v-for="option in column.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Search Input -->
    <div v-else-if="column.type === 'search'" class="relative">
      <input
        :value="value"
        @input="handleInput"
        @blur="handleBlur"
        class="w-full px-2 py-1 pr-8 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
        :placeholder="getSearchPlaceholder(column.searchType)"
      />
      <button
        @click="handleSearchClick"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
        title="Rechercher"
      >
        <Search class="w-4 h-4" />
      </button>
    </div>

    <!-- Fallback -->
    <input
      v-else
      :value="value"
      @input="handleInput"
      @blur="handleBlur"
      class="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500 focus:border-sage-blue-500"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Calendar, Search } from 'lucide-vue-next'

const props = defineProps({
  value: [String, Number],
  column: Object,
  rowId: String
})

const emit = defineEmits(['update', 'searchClick'])

const showDatePicker = ref(false)

const handleInput = (event) => {
  emit('update', {
    rowId: props.rowId,
    columnId: props.column.id,
    value: event.target.value
  })
}

const handleBlur = () => {
  // Validation ou formatage si nécessaire
}

const handleSelect = (event) => {
  emit('update', {
    rowId: props.rowId,
    columnId: props.column.id,
    value: event.target.value
  })
}

const handleCurrencyInput = (event) => {
  let value = event.target.value
  // Formatage basique pour les devises
  value = value.replace(/[^\d,.-]/g, '')
  emit('update', {
    rowId: props.rowId,
    columnId: props.column.id,
    value: value
  })
}

const handleDateChange = (event) => {
  const date = new Date(event.target.value)
  const formattedDate = date.toLocaleDateString('fr-FR')
  emit('update', {
    rowId: props.rowId,
    columnId: props.column.id,
    value: formattedDate
  })
  showDatePicker.value = false
}

const handleSearchClick = () => {
  emit('searchClick', {
    rowId: props.rowId,
    columnId: props.column.id,
    searchType: props.column.searchType
  })
}

const getDateValue = (frenchDate) => {
  if (!frenchDate) return ''
  try {
    const parts = frenchDate.split('/')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
  } catch (e) {
    console.error('Date parsing error:', e)
  }
  return ''
}

const getSearchPlaceholder = (searchType) => {
  const placeholders = {
    product: 'Rechercher un produit...',
    supplier: 'Rechercher un fournisseur...',
    customer: 'Rechercher un client...',
    article: 'Rechercher un article...'
  }
  return placeholders[searchType] || 'Rechercher...'
}

// Fermer le date picker en cliquant à l'extérieur
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDatePicker.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>