<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">Print Template Configuration</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
        <div class="space-y-6">
          <!-- Template Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Template
            </label>
            <select
              v-model="selectedTemplate"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a template...</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">
                {{ template.name }}
              </option>
            </select>
          </div>

          <!-- Page Settings -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Page Size
              </label>
              <select
                v-model="config.pageSize"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Orientation
              </label>
              <select
                v-model="config.orientation"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>

          <!-- Margins -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Margins (mm)
            </label>
            <div class="grid grid-cols-4 gap-2">
              <div>
                <label class="block text-xs text-gray-500 mb-1">Top</label>
                <input
                  v-model.number="config.margins.top"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Right</label>
                <input
                  v-model.number="config.margins.right"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Bottom</label>
                <input
                  v-model.number="config.margins.bottom"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">Left</label>
                <input
                  v-model.number="config.margins.left"
                  type="number"
                  min="0"
                  class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Header/Footer Options -->
          <div class="space-y-4">
            <div class="flex items-center">
              <input
                v-model="config.includeHeader"
                type="checkbox"
                id="includeHeader"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="includeHeader" class="ml-2 text-sm text-gray-700">
                Include Header
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                v-model="config.includeFooter"
                type="checkbox"
                id="includeFooter"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="includeFooter" class="ml-2 text-sm text-gray-700">
                Include Footer
              </label>
            </div>
            
            <div class="flex items-center">
              <input
                v-model="config.includePageNumbers"
                type="checkbox"
                id="includePageNumbers"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="includePageNumbers" class="ml-2 text-sm text-gray-700">
                Include Page Numbers
              </label>
            </div>
          </div>

          <!-- Font Settings -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Font Family
              </label>
              <select
                v-model="config.fontFamily"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Calibri">Calibri</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <input
                v-model.number="config.fontSize"
                type="number"
                min="8"
                max="72"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="saveConfiguration"
          class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Save Configuration
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { X } from 'lucide-vue-next'

export default {
  name: 'PrintTemplateConfigModal',
  components: {
    X
  },
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    initialConfig: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['close', 'save'],
  data() {
    return {
      selectedTemplate: '',
      templates: [
        { id: 'standard', name: 'Standard Template' },
        { id: 'minimal', name: 'Minimal Template' },
        { id: 'detailed', name: 'Detailed Template' },
        { id: 'custom', name: 'Custom Template' }
      ],
      config: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        includeHeader: true,
        includeFooter: true,
        includePageNumbers: true,
        fontFamily: 'Arial',
        fontSize: 12
      }
    }
  },
  watch: {
    initialConfig: {
      handler(newConfig) {
        if (newConfig && Object.keys(newConfig).length > 0) {
          this.config = { ...this.config, ...newConfig }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    saveConfiguration() {
      const configData = {
        template: this.selectedTemplate,
        ...this.config
      }
      this.$emit('save', configData)
      this.$emit('close')
    }
  }
}
</script>