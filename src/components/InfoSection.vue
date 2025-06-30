<template>
  <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ title }}</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        label="Référence douanière"
        type="text"
        :value="formData.customsRef"
        :searchable="true"
        @change="(value) => $emit('inputChange', 'customsRef', value)"
      />
      <FormField
        label="Région/État"
        type="text"
        :value="formData.regionState"
        :searchable="true"
        @change="(value) => $emit('inputChange', 'regionState', value)"
      />
    </div>
    
    <div class="mt-6">
      <div class="flex items-center space-x-4 mb-4">
        <div class="flex items-center">
          <input
            type="checkbox"
            id="soumis-deb"
            class="mr-2 w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
          />
          <label for="soumis-deb" class="text-gray-700 dark:text-gray-300 text-sm">
            Soumis à la DEB
          </label>
        </div>
        <div class="flex items-center">
          <input
            type="checkbox"
            id="pdt-encours"
            class="mr-2 w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
          />
          <label for="pdt-encours" class="text-gray-700 dark:text-gray-300 text-sm">
            Pdt encours modification
          </label>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <FormField
          label="Date mise app. mod"
          type="date"
          value=""
          @change="(value) => $emit('inputChange', 'dateModification', value)"
        />
        <FormField
          label="Site par défaut"
          type="text"
          value=""
          @change="(value) => $emit('inputChange', 'siteDefaut', value)"
        />
      </div>
    </div>
    
    <div class="mt-6">
      <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Familles statistiques</h4>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <FormField
          label="Division"
          type="text"
          :value="formData.division"
          :searchable="true"
          @change="(value) => $emit('inputChange', 'division', value)"
        />
        <FormField
          label="Famille"
          type="text"
          :value="formData.family"
          :searchable="true"
          @change="(value) => $emit('inputChange', 'family', value)"
        />
        <FormField
          label="Sous-famille"
          type="text"
          :value="formData.subFamily"
          :searchable="true"
          @change="(value) => $emit('inputChange', 'subFamily', value)"
        />
        <FormField
          label="Achat type art."
          type="text"
          :value="formData.purchaseType"
          :searchable="true"
          @change="(value) => $emit('inputChange', 'purchaseType', value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import FormField from './FormField.vue'

defineProps({
  title: String,
  formData: Object
})

defineEmits(['inputChange'])
</script>