<template>
  <div :class="`${isMobile 
      ? 'flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-700 justify-center' 
      : 'flex flex-col gap-2 p-2 bg-gray-100 dark:bg-gray-700 min-h-full justify-start items-center border-l border-gray-200 dark:border-gray-600'} text-sm`">
    
    <!-- Top Actions -->
    <button 
      @click="$emit('action', 'save')" 
      title="Enregistrer" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Save class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'refresh')" 
      title="Actualiser" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <RotateCcw class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'copy')" 
      title="Copier" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Copy class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'delete')" 
      title="Supprimer" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Trash2 class="w-5 h-5" />
    </button>

    <!-- Separator -->
    <div class="border-t border-gray-300 dark:border-gray-600 my-2" />

    <!-- Bottom Actions -->
    <button 
      @click="$emit('action', 'print')" 
      title="Imprimer" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Printer class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'email')" 
      title="Envoyer par email" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Mail class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'grid')" 
      title="Vue grille" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <Grid3X3 class="w-5 h-5" />
    </button>
    <button 
      @click="$emit('action', 'chart')" 
      title="Graphiques" 
      class="w-9 h-9 flex items-center justify-center rounded-md bg-white dark:bg-gray-600 hover:bg-sage-blue-50 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-white shadow-sm border border-gray-200 dark:border-gray-500"
    >
      <BarChart3 class="w-5 h-5" />
    </button>
  </div>
</template>

<script setup>
import { Save, RotateCcw, Copy, Trash2, Printer, Mail, Grid3X3, BarChart3 } from 'lucide-vue-next'

defineProps({
  isMobile: {
    type: Boolean,
    default: false
  }
})

defineEmits(['action'])
</script>