Here's the fixed template with all missing closing brackets added:

<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
    <div class="bg-white dark:bg-gray-800 rounded-none sm:rounded-lg shadow-xl w-full h-full sm:max-w-7xl sm:max-h-[95vh] sm:w-auto sm:h-auto overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-purple-700">
        <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <Settings class="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
          <h2 class="text-sm sm:text-xl font-semibold text-white truncate">Gestionnaire de Modèles d'Impression</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 transition-colors p-1 flex-shrink-0"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="flex flex-col sm:flex-row h-[calc(100vh-60px)] sm:h-[calc(95vh-80px)]">
        <!-- Rest of the template content -->
      </div>

      <!-- Footer -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 gap-3 sm:gap-0">
        <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 order-2 sm:order-1">
          {{ templates.length }} modèle(s) configuré(s)
        </div>
        <div class="flex space-x-2 sm:space-x-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            @click="$emit('close')"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Fermer
          </button>
          <button
            v-if="selectedTemplate"
            @click="saveTemplate"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors"
          >
            <Save class="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Settings, X, Plus, Star, Copy, Trash2, FileText, Info, Table, Calculator,
  Palette, Monitor, Printer, Eye, Save, Receipt, Package, Truck, CreditCard,
  BarChart3, Users, ShoppingCart, Wrench
} from 'lucide-vue-next'
import TemplateSection from './TemplateSection.vue'
import GenericDocumentPreview from './GenericDocumentPreview.vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'save', 'delete'])

const selectedDocumentType = ref(null)
const selectedTemplate = ref(null)
const previewMode = ref('desktop')

// Rest of the script content
</script>