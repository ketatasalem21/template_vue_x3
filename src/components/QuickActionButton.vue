<template>
  <button
    @click="$emit('click')"
    class="w-full flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors text-left"
  >
    <div :class="`w-8 h-8 rounded-lg ${action.color} flex items-center justify-center`">
      <component :is="iconComponent" class="w-4 h-4 text-white" />
    </div>
    <span class="font-medium text-gray-900 dark:text-white">{{ action.label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Package, ShoppingCart, FileText, UserPlus, BarChart3, Settings, Award, AlertTriangle, Beaker } from 'lucide-vue-next'

const props = defineProps({
  action: Object
})

defineEmits(['click'])

const iconComponents = {
  Package,
  ShoppingCart,
  FileText,
  UserPlus,
  BarChart3,
  Settings,
  Award,
  AlertTriangle,
  Beaker
}

const iconComponent = computed(() => iconComponents[props.action.icon] || Package)
</script>