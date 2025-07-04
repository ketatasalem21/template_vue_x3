<template>
  <div class="print-template-manager">
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Print Template Manager</h2>
        <p class="text-sm text-gray-600 mt-1">Manage and configure print templates</p>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="template in templates" 
            :key="template.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            @click="selectTemplate(template)"
          >
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-medium text-gray-900">{{ template.name }}</h3>
              <button 
                @click.stop="editTemplate(template)"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-gray-600 mb-3">{{ template.description }}</p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span>{{ template.type }}</span>
              <span>{{ template.lastModified }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end">
          <button 
            @click="createNewTemplate"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            New Template
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PrintTemplateManager',
  data() {
    return {
      templates: [
        {
          id: 1,
          name: 'Invoice Template',
          description: 'Standard invoice layout with company branding',
          type: 'Invoice',
          lastModified: '2024-01-15'
        },
        {
          id: 2,
          name: 'Report Template',
          description: 'Professional report format with charts and tables',
          type: 'Report',
          lastModified: '2024-01-12'
        },
        {
          id: 3,
          name: 'Label Template',
          description: 'Product label template with barcode support',
          type: 'Label',
          lastModified: '2024-01-10'
        }
      ]
    }
  },
  methods: {
    selectTemplate(template) {
      this.$emit('template-selected', template);
    },
    editTemplate(template) {
      this.$emit('edit-template', template);
    },
    createNewTemplate() {
      this.$emit('create-template');
    }
  }
}
</script>

<style scoped>
.print-template-manager {
  @apply w-full;
}
</style>