<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">{{ title }}</p>
        <p class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ value }}</p>
        <div class="flex items-center mt-2">
          <span :class="`text-sm font-medium ${trendPositive ? 'text-green-600' : 'text-red-600'}`">
            {{ trend }}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-1">vs hier</span>
        </div>
        <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
      <div :class="`w-10 h-10 lg:w-12 lg:h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`">
        <component :is="iconComponent" class="w-5 h-5 lg:w-6 lg:h-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Package, ShoppingCart, FileText, Users, Zap, Award, AlertTriangle, Beaker } from 'lucide-vue-next'

const props = defineProps({
  title: String,
  value: String,
  icon: String,
  color: String,
  trend: String,
  trendPositive: Boolean,
  subtitle: String
})

const iconComponents = {
  Package,
  ShoppingCart,
  FileText,
  Users,
  Zap,
  Award,
  AlertTriangle,
  Beaker
}

const iconComponent = computed(() => iconComponents[props.icon] || Package)
</script>