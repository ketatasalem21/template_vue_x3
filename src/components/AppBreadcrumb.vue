<template>
  <div class="flex items-center space-x-2 text-sm relative">
    <div v-for="(item, index) in breadcrumbData" :key="index" class="flex items-center space-x-2 relative">
      <div class="relative">
        <button
          @click="handleBreadcrumbClick(index, item)"
          :class="`flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors ${
            item.children && item.children.length > 0 ? 'cursor-pointer' : ''
          }`"
        >
          <span>{{ item.label }}</span>
          <ChevronDown 
            v-if="item.children && item.children.length > 0"
            :class="`w-3 h-3 transition-transform ${
              openDropdown === index ? 'rotate-180' : ''
            }`" 
          />
        </button>
        
        <div
          v-if="openDropdown === index && item.children"
          ref="dropdownRef"
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 min-w-48 max-h-80 overflow-y-auto"
        >
          <button
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            @click="handleDropdownItemClick(child)"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
          >
            {{ child.label }}
          </button>
        </div>
      </div>
      
      <ChevronRight v-if="index < breadcrumbData.length - 1" class="w-4 h-4 text-gray-400" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ChevronRight, ChevronDown } from 'lucide-vue-next'

const breadcrumbData = [
  {
    label: 'Tout',
    children: [
      { label: 'Données de base', href: '#' },
      { label: 'Paramétrage', href: '#' },
      { label: 'Administration', href: '#' },
      { label: 'Développement', href: '#' },
      { label: 'Relation client', href: '#' },
      { label: 'Achats', href: '#' },
      { label: 'Ventes', href: '#' },
      { label: 'Stocks', href: '#' },
      { label: 'Conception de produit', href: '#' },
      { label: 'Production', href: '#' },
      { label: 'Gestion des indices', href: '#' },
      { label: 'Contrôle de gestion', href: '#' },
      { label: 'Comptabilité', href: '#' },
      { label: 'Comptabilité tiers', href: '#' },
      { label: 'Déclarations', href: '#' },
      { label: 'Immobilisations', href: '#' },
      { label: 'Terminaux portables', href: '#' },
      { label: 'Exploitation', href: '#' },
      { label: 'Impressions', href: '#' },
      { label: 'Traductions', href: '#' },
      { label: 'Pages en lecture seule', href: '#' }
    ]
  },
  {
    label: 'Données de base',
    children: [
      { label: 'Articles', href: '#' },
      { label: 'Clients', href: '#' },
      { label: 'Fournisseurs', href: '#' },
      { label: 'Nomenclatures', href: '#' },
      { label: 'Gammes', href: '#' },
      { label: 'Sites', href: '#' },
      { label: 'Emplacements', href: '#' },
      { label: 'Transporteurs', href: '#' },
      { label: 'Représentants', href: '#' },
      { label: 'Devises', href: '#' }
    ]
  },
  {
    label: 'Articles',
    children: [
      { label: 'Consultation', href: '#' },
      { label: 'Création', href: '#' },
      { label: 'Modification', href: '#' },
      { label: 'Suppression', href: '#' },
      { label: 'Import/Export', href: '#' },
      { label: 'Duplication', href: '#' },
      { label: 'Historique', href: '#' }
    ]
  }
]

const openDropdown = ref(null)

const handleBreadcrumbClick = (index, item) => {
  if (item.children && item.children.length > 0) {
    openDropdown.value = openDropdown.value === index ? null : index
  }
}

const handleDropdownItemClick = (item) => {
  console.log('Navigating to:', item.label)
  openDropdown.value = null
}

const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative')) {
    openDropdown.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>