<template>
  <!-- Desktop Layout -->
  <div ref="containerRef" class="hidden lg:flex h-full relative">
    <!-- Left Panel -->
    <div
      :style="{ width: leftCollapsed ? '0px' : `${currentSplit}%` }"
      class="transition-all duration-300 overflow-hidden"
    >
      <slot name="left" />
    </div>

    <!-- Splitter + Buttons -->
    <div class="relative flex items-center">
      <!-- Left toggle -->
      <div class="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20">
        <button
          @click="toggleLeftPanel"
          class="w-6 h-6 bg-gray-200 dark:bg-gray-700 hover:bg-sage-blue-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors shadow-lg"
          :title="leftCollapsed ? 'Afficher le panneau gauche' : 'Masquer le panneau gauche'"
        >
          <ChevronRight v-if="leftCollapsed" class="w-3 h-3 text-gray-600 dark:text-gray-300" />
          <PanelLeftClose v-else class="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <!-- Drag bar -->
      <div
        :class="`w-1 bg-gray-300 dark:bg-gray-700 hover:bg-sage-blue-700 cursor-col-resize relative h-full ${
          isDragging ? 'bg-sage-blue-700' : ''
        } ${leftCollapsed || rightCollapsed ? 'cursor-default opacity-50' : ''}`"
        @mousedown="handleMouseDown"
      >
        <div v-if="!leftCollapsed && !rightCollapsed" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-400 dark:bg-gray-500 rounded-full" />
      </div>

      <!-- Right toggle -->
      <div class="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
        <button
          @click="toggleRightPanel"
          class="w-6 h-6 bg-gray-200 dark:bg-gray-700 hover:bg-sage-blue-700 rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors shadow-lg"
          :title="rightCollapsed ? 'Afficher le panneau droit' : 'Masquer le panneau droit'"
        >
          <ChevronLeft v-if="rightCollapsed" class="w-3 h-3 text-gray-600 dark:text-gray-300" />
          <PanelRightClose v-else class="w-3 h-3 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>

    <!-- Right Panel -->
    <div
      :style="{ width: rightCollapsed ? '0px' : `${100 - currentSplit}%` }"
      class="transition-all duration-300 overflow-hidden flex-1"
    >
      <slot name="right" />
    </div>

    <!-- Floating: Left Button -->
    <button
      v-if="leftCollapsed"
      @click="toggleLeftPanel"
      class="fixed left-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-sage-blue-700 hover:bg-sage-blue-800 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors shadow-lg z-30"
      title="Afficher le panneau gauche"
    >
      <ChevronRight class="w-4 h-4 text-white" />
    </button>

    <!-- Floating: Right Button -->
    <button
      v-if="rightCollapsed"
      @click="toggleRightPanel"
      class="fixed right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-sage-blue-700 hover:bg-sage-blue-800 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center transition-colors shadow-lg z-30"
      title="Afficher le panneau droit"
    >
      <ChevronLeft class="w-4 h-4 text-white" />
    </button>
  </div>

  <!-- Mobile Layout -->
  <div class="lg:hidden h-[calc(100vh-60px)] overflow-hidden">
    <div
      class="flex w-[200%] h-full transition-transform duration-300"
      :style="{ transform: showRightOnMobile ? 'translateX(-50%)' : 'translateX(0%)' }"
    >
      <div class="w-1/2 h-full overflow-y-auto">
        <slot name="left" />
      </div>
      <div class="w-1/2 h-full overflow-y-auto">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose } from 'lucide-vue-next'

const props = defineProps({
  initialSplitPercentage: {
    type: Number,
    default: 25
  },
  minLeftWidth: {
    type: Number,
    default: 200
  },
  minRightWidth: {
    type: Number,
    default: 400
  },
  showRightOnMobile: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['mobileToggle'])

const splitPercentage = ref(props.initialSplitPercentage)
const isDragging = ref(false)
const leftCollapsed = ref(false)
const rightCollapsed = ref(false)
const lastSplitPercentage = ref(props.initialSplitPercentage)
const containerRef = ref()

const currentSplit = computed(() => {
  if (leftCollapsed.value) return 0
  if (rightCollapsed.value) return 100
  return splitPercentage.value
})

const handleMouseDown = (e) => {
  e.preventDefault()
  if (!leftCollapsed.value && !rightCollapsed.value) {
    isDragging.value = true
  }
}

const toggleLeftPanel = () => {
  if (leftCollapsed.value) {
    splitPercentage.value = lastSplitPercentage.value
    leftCollapsed.value = false
    rightCollapsed.value = false
  } else {
    if (!rightCollapsed.value) {
      lastSplitPercentage.value = splitPercentage.value
    }
    splitPercentage.value = 0
    leftCollapsed.value = true
    rightCollapsed.value = false
  }
}

const toggleRightPanel = () => {
  if (rightCollapsed.value) {
    splitPercentage.value = lastSplitPercentage.value
    rightCollapsed.value = false
    leftCollapsed.value = false
  } else {
    if (!leftCollapsed.value) {
      lastSplitPercentage.value = splitPercentage.value
    }
    splitPercentage.value = 100
    rightCollapsed.value = true
    leftCollapsed.value = false
  }
}

const handleMouseMove = (e) => {
  if (!isDragging.value || !containerRef.value || leftCollapsed.value || rightCollapsed.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  let newPercentage = (mouseX / rect.width) * 100

  const minLeft = (props.minLeftWidth / rect.width) * 100
  const minRight = (props.minRightWidth / rect.width) * 100

  newPercentage = Math.max(minLeft, Math.min(100 - minRight, newPercentage))

  splitPercentage.value = newPercentage
  lastSplitPercentage.value = newPercentage
}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>