<template>
  <div class="flex h-full bg-gray-50 dark:bg-gray-900">
    <!-- Left Panel (Sidebar) -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        // Desktop: always show with specified width
        'hidden lg:block lg:w-80',
        // Mobile: show full width when showRightOnMobile is false
        showRightOnMobile ? 'lg:w-80' : 'block w-full lg:w-80'
      ]"
      :style="{ 
        minWidth: minLeftWidth + 'px',
        width: showRightOnMobile ? '' : '100%'
      }"
    >
      <slot name="left"></slot>
    </div>

    <!-- Right Panel (Main Content) -->
    <div 
      :class="[
        'flex-1 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800',
        // Desktop: always show
        'hidden lg:block',
        // Mobile: show when showRightOnMobile is true
        showRightOnMobile ? 'block w-full lg:flex-1' : 'lg:block lg:flex-1'
      ]"
      :style="{ 
        minWidth: minRightWidth + 'px',
        width: showRightOnMobile ? '100%' : ''
      }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  initialSplitPercentage: {
    type: Number,
    default: 30
  },
  minLeftWidth: {
    type: Number,
    default: 200
  },
  minRightWidth: {
    type: Number,
    default: 300
  },
  showRightOnMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['mobile-toggle'])

// Watch for changes in showRightOnMobile and emit to parent
watch(() => props.showRightOnMobile, (newValue) => {
  emit('mobile-toggle', newValue)
})
</script>