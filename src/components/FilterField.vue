<template>
  <div class="relative">
    <div class="flex items-center justify-between mb-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ filter.label }}
      </label>
      <button
        @click="$emit('remove', filter.id)"
        class="text-gray-400 hover:text-red-500 transition-colors"
        title="Supprimer ce filtre"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Operator Selection (if multiple operators available) -->
    <div v-if="filter.operators && filter.operators.length > 1" class="mb-2">
      <select
        :value="filter.operator"
        @change="updateOperator($event.target.value)"
        class="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      >
        <option
          v-for="operator in filter.operators"
          :key="operator"
          :value="operator"
        >
          {{ getOperatorLabel(operator) }}
        </option>
      </select>
    </div>

    <!-- Text Input -->
    <input
      v-if="filter.type === 'text'"
      :value="value"
      @input="handleInput"
      type="text"
      :placeholder="`Filtrer par ${filter.label.toLowerCase()}...`"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
    />

    <!-- Number Input -->
    <input
      v-else-if="filter.type === 'number'"
      :value="value"
      @input="handleInput"
      type="number"
      step="0.01"
      :placeholder="`Valeur ${filter.label.toLowerCase()}...`"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
    />

    <!-- Date Input -->
    <input
      v-else-if="filter.type === 'date'"
      :value="value"
      @input="handleInput"
      type="date"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
    />

    <!-- Select Input -->
    <select
      v-else-if="filter.type === 'select'"
      :value="value"
      @change="handleSelect"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
    >
      <option value="">Tous</option>
      <option
        v-for="option in filter.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Search Input -->
    <div v-else-if="filter.type === 'search'" class="relative">
      <input
        :value="value"
        @input="handleInput"
        type="text"
        :placeholder="`Rechercher ${filter.label.toLowerCase()}...`"
        class="w-full px-3 py-2 pr-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sage-blue-500"
      />
      <button
        @click="openSearchModal"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
      >
        <Search class="w-4 h-4" />
      </button>
    </div>

    <!-- Range Input (for between operator) -->
    <div v-if="filter.operator === 'between'" class="grid grid-cols-2 gap-2 mt-2">
      <input
        :value="rangeValue.min"
        @input="handleRangeInput('min', $event)"
        :type="filter.type === 'date' ? 'date' : 'number'"
        placeholder="Min"
        class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <input
        :value="rangeValue.max"
        @input="handleRangeInput('max', $event)"
        :type="filter.type === 'date' ? 'date' : 'number'"
        placeholder="Max"
        class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X, Search } from 'lucide-vue-next'

const props = defineProps({
  filter: Object,
  value: [String, Number, Object]
})

const emit = defineEmits(['update', 'remove'])

const rangeValue = computed(() => {
  if (typeof props.value === 'object' && props.value !== null) {
    return props.value
  }
  return { min: '', max: '' }
})

const handleInput = (event) => {
  emit('update', {
    fieldId: props.filter.id,
    value: event.target.value
  })
}

const handleSelect = (event) => {
  emit('update', {
    fieldId: props.filter.id,
    value: event.target.value
  })
}

const handleRangeInput = (type, event) => {
  const newRange = { ...rangeValue.value }
  newRange[type] = event.target.value
  emit('update', {
    fieldId: props.filter.id,
    value: newRange
  })
}

const updateOperator = (operator) => {
  props.filter.operator = operator
}

const openSearchModal = () => {
  // Ouvrir modal de recherche
  console.log('Open search modal for:', props.filter.searchType)
}

const getOperatorLabel = (operator) => {
  const labels = {
    equals: 'Égal à',
    not_equals: 'Différent de',
    contains: 'Contient',
    starts_with: 'Commence par',
    ends_with: 'Finit par',
    greater_than: 'Supérieur à',
    less_than: 'Inférieur à',
    between: 'Entre',
    in: 'Dans la liste'
  }
  return labels[operator] || operator
}
</script>