<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <!-- Select -->
    <div v-if="type === 'select'" class="relative">
      <select
        :value="value"
        @change="$emit('change', $event.target.value)"
        :class="baseInputClass"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
      <Search v-if="searchable" class="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
    
    <!-- Date -->
    <input
      v-else-if="type === 'date'"
      type="text"
      :value="value"
      @input="$emit('change', $event.target.value)"
      placeholder="DD/MM/YY"
      :class="baseInputClass"
    />
    
    <!-- Checkbox -->
    <input
      v-else-if="type === 'checkbox'"
      type="checkbox"
      :checked="value === 'true'"
      @change="$emit('change', $event.target.checked.toString())"
      class="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
    />
    
    <!-- Text -->
    <div v-else class="relative">
      <input
        type="text"
        :value="value"
        @input="$emit('change', $event.target.value)"
        :placeholder="placeholder"
        :class="baseInputClass"
      />
      <Search v-if="searchable" class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Search } from 'lucide-vue-next'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  }
})

defineEmits(['change'])

const baseInputClass = computed(() => 
  "w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
)
</script>