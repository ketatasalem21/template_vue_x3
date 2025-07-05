<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900">Print Options</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X class="w-6 h-6" />
        </button>
      </div>
      
      <div class="p-6 overflow-y-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Print Settings -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Print Settings</h3>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Paper Size
              </label>
              <select
                v-model="printSettings.paperSize"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="A4">A4</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Orientation
              </label>
              <div class="flex space-x-4">
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="printSettings.orientation"
                    value="portrait"
                    class="mr-2"
                  />
                  Portrait
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="printSettings.orientation"
                    value="landscape"
                    class="mr-2"
                  />
                  Landscape
                </label>
              </div>
            </div>
            
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="printSettings.includeHeaders"
                  class="mr-2"
                />
                Include Headers
              </label>
            </div>
            
            <div>
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="printSettings.includeFooters"
                  class="mr-2"
                />
                Include Footers
              </label>
            </div>
          </div>
          
          <!-- Preview -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">Preview</h3>
            <div class="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[300px] flex items-center justify-center">
              <div class="text-gray-500 text-center">
                <Printer class="w-12 h-12 mx-auto mb-2" />
                <p>Print preview will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handlePrint"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Printer class="w-4 h-4 mr-2" />
          Print
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { X, Printer } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close', 'print'])

const printSettings = reactive({
  paperSize: 'A4',
  orientation: 'portrait',
  includeHeaders: true,
  includeFooters: true
})

const handlePrint = () => {
  // Emit print event with settings
  emit('print', printSettings)
}
</script>