<template>
  <div class="flex h-full bg-gray-50 dark:bg-gray-900">
    <!-- Left Panel (Sidebar) -->
    <div 
      :class="[
        'transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
        // Desktop: always show with specified width
        'lg:block lg:w-80',
        // Mobile: show when NOT showRightOnMobile
        showRightOnMobile ? 'hidden' : 'block w-full'
      ]"
      :style="{ 
        minWidth: minLeftWidth + 'px'
      }"
    >
      <slot name="left"></slot>
    </div>

    <!-- Right Panel (Main Content) -->
    <div 
      :class="[
        'flex-1 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800',
        // Desktop: always show
        'lg:block lg:flex-1',
        // Mobile: show when showRightOnMobile is true
        showRightOnMobile ? 'block w-full' : 'hidden'
      ]"
      :style="{ 
        minWidth: minRightWidth + 'px'
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