<template>
  <div class="app-splitter h-full flex">
    <div 
      class="splitter-panel"
      :style="{ width: leftWidth + '%' }"
    >
      <slot name="left"></slot>
    </div>
    
    <div 
      class="splitter-handle bg-gray-200 hover:bg-gray-300 cursor-col-resize flex items-center justify-center transition-colors duration-200"
      :style="{ width: handleWidth + 'px' }"
      @mousedown="startResize"
    >
      <div class="w-1 h-8 bg-gray-400 rounded"></div>
    </div>
    
    <div 
      class="splitter-panel flex-1"
      :style="{ width: rightWidth + '%' }"
    >
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSplitter',
  props: {
    initialLeftWidth: {
      type: Number,
      default: 50
    },
    minLeftWidth: {
      type: Number,
      default: 20
    },
    maxLeftWidth: {
      type: Number,
      default: 80
    },
    handleWidth: {
      type: Number,
      default: 4
    }
  },
  data() {
    return {
      leftWidth: this.initialLeftWidth,
      isResizing: false
    }
  },
  computed: {
    rightWidth() {
      return 100 - this.leftWidth
    }
  },
  methods: {
    startResize(event) {
      this.isResizing = true
      document.addEventListener('mousemove', this.handleResize)
      document.addEventListener('mouseup', this.stopResize)
      event.preventDefault()
    },
    handleResize(event) {
      if (!this.isResizing) return
      
      const container = this.$el
      const containerRect = container.getBoundingClientRect()
      const newLeftWidth = ((event.clientX - containerRect.left) / containerRect.width) * 100
      
      this.leftWidth = Math.max(
        this.minLeftWidth,
        Math.min(this.maxLeftWidth, newLeftWidth)
      )
    },
    stopResize() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.handleResize)
      document.removeEventListener('mouseup', this.stopResize)
    }
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.handleResize)
    document.removeEventListener('mouseup', this.stopResize)
  }
}
</script>

<style scoped>
.app-splitter {
  user-select: none;
}

.splitter-handle {
  min-width: 4px;
}

.splitter-panel {
  overflow: hidden;
}
</style>