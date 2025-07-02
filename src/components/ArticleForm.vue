<template>
  <div v-if="activeTab !== 'identification'" class="p-6">
    <div class="text-center py-12">
      <h3 class="text-xl text-gray-500 dark:text-gray-400">Fonctionnalité {{ activeTab }} en développement</h3>
      <p class="text-gray-400 dark:text-gray-500 mt-2">Cette section sera disponible prochainement</p>
    </div>
  </div>

  <div v-else class="p-4 lg:p-6 space-y-6">
    <!-- Status and Category Section -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <FormField
          label="Catégorie"
          type="select"
          :value="formData.category"
          :options="[
            { value: 'ACH', label: 'ACH' },
            { value: 'FAB', label: 'FAB' },
            { value: 'FAV', label: 'FAV' },
            { value: 'FPV', label: 'FPV' }
          ]"
          :required="true"
          @change="(value) => handleInputChange('category', value)"
        />
        <FormField
          label="Statut article"
          type="select"
          :value="formData.status"
          :options="[
            { value: 'Non utilisable', label: 'Non utilisable' },
            { value: 'Acheté', label: 'Acheté' },
            { value: 'Fabriqué', label: 'Fabriqué' }
          ]"
          :required="true"
          @change="(value) => handleInputChange('status', value)"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        <div class="relative">
          <FormField
            label="Article"
            type="text"
            :value="formData.articleCode"
            placeholder="Code article"
            @change="(value) => handleInputChange('articleCode', value)"
          />
          <button
            @click="$emit('searchClick')"
            class="absolute right-3 top-8 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
            title="Rechercher un article"
          >
            <Search class="w-4 h-4" />
          </button>
        </div>
        <FormField
          label=""
          type="text"
          :value="formData.articleName"
          placeholder="Nom article"
          @change="(value) => handleInputChange('articleName', value)"
        />
      </div>
    </div>

    <!-- Identification Section -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Identification</h3>
        <button class="text-gray-400 hover:text-gray-600 dark:hover:text-white">
          <span class="text-lg">↕</span>
        </button>
      </div>
      
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <div>
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Image</h4>
          <ImageUpload />
        </div>
        
        <div>
          <h4 class="text-md font-medium text-gray-900 dark:text-white mb-4">Utilisation</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Début vie"
              type="date"
              :value="formData.startDate"
              @change="(value) => handleInputChange('startDate', value)"
            />
            <FormField
              label="Fin vie"
              type="date"
              :value="formData.endDate"
              @change="(value) => handleInputChange('endDate', value)"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <input
                type="checkbox"
                id="production-text"
                class="mr-2"
              />
              <label for="production-text" class="text-gray-600 dark:text-gray-300 text-sm">
                Texte production
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                id="preparation-text"
                class="mr-2"
              />
              <label for="preparation-text" class="text-gray-600 dark:text-gray-300 text-sm">
                Texte préparation
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Identification Section -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Identification</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <FormField
          label="Désignation 2"
          type="text"
          :value="formData.designation2"
          @change="(value) => handleInputChange('designation2', value)"
        />
        <FormField
          label="Désignation 3"
          type="text"
          :value="formData.designation3"
          @change="(value) => handleInputChange('designation3', value)"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
        <FormField
          label="Seg. phrases d'appel"
          type="text"
          :value="formData.segPhrasesAppel"
          @change="(value) => handleInputChange('segPhrasesAppel', value)"
        />
        <FormField
          label="Seg. H/M standing"
          type="text"
          :value="formData.segHMStanding"
          @change="(value) => handleInputChange('segHMStanding', value)"
        />
        <FormField
          label="Seg. DAS"
          type="text"
          :value="formData.segDAS"
          @change="(value) => handleInputChange('segDAS', value)"
        />
      </div>
    </div>

    <!-- Tableau Interactif -->
    <InteractiveTable
      title="Lignes de commande"
      :articles="sampleArticles"
      @data-change="handleTableDataChange"
    />

    <!-- Divers Section -->
    <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Divers</h3>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <FormField
          label="Clé recherche"
          type="text"
          :value="formData.searchKey"
          @change="(value) => handleInputChange('searchKey', value)"
        />
        <FormField
          label="Ligne de produit"
          type="text"
          :value="formData.productLine"
          @change="(value) => handleInputChange('productLine', value)"
        />
        <FormField
          label="Code EAN"
          type="text"
          :value="formData.eanCode"
          @change="(value) => handleInputChange('eanCode', value)"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Norme</label>
          <div class="text-gray-500 dark:text-gray-400">--</div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Accès gestionnaire</label>
          <div class="text-gray-500 dark:text-gray-400">--</div>
        </div>
      </div>
    </div>

    <!-- Information UE Section -->
    <InfoSection
      title="Informations UE"
      :form-data="formData"
      @input-change="handleInputChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import FormField from './FormField.vue'
import ImageUpload from './ImageUpload.vue'
import InfoSection from './InfoSection.vue'
import InteractiveTable from './InteractiveTable.vue'

defineProps({
  article: Object,
  activeTab: String
})

defineEmits(['searchClick'])

const formData = ref({
  category: 'ACH',
  status: 'Non utilisable',
  articleCode: 'B102000',
  articleName: 'GANT PICOT NOIR "POLISSAGE"',
  startDate: '15/09/15',
  endDate: '',
  designation2: '',
  designation3: '',
  segPhrasesAppel: '',
  segHMStanding: '',
  segDAS: '',
  searchKey: '',
  productLine: '',
  eanCode: '',
  customsRef: '',
  regionState: '',
  division: '',
  family: '',
  subFamily: '',
  purchaseType: 'CNADI'
})

const sampleArticles = ref([
  { id: 'EXP007', code: 'EXP007', name: 'RTC 40M Invoicing terms' },
  { id: 'EXP008', code: 'EXP008', name: 'Service maintenance' },
  { id: 'EXP009', code: 'EXP009', name: 'Formation utilisateur' }
])

const handleInputChange = (field, value) => {
  formData.value = { ...formData.value, [field]: value }
}

const handleTableDataChange = (data) => {
  console.log('Table data changed:', data)
  // Ici vous pouvez traiter les données du tableau
}
</script>