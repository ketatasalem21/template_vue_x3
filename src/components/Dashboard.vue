<template>
  <div class="p-4 lg:p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
    <!-- Welcome Section -->
    <div class="bg-gradient-to-r from-sage-blue-700 via-sage-blue-600 to-blue-600 rounded-xl p-6 lg:p-8 text-white shadow-lg">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between">
        <div class="mb-4 lg:mb-0">
          <h1 class="text-2xl lg:text-3xl font-bold mb-2">Laboratoire Galvanoplastie</h1>
          <p class="text-sage-blue-100">Bienvenue, SALEM KETATA - Super administrateur</p>
          <p class="text-sage-blue-200 text-sm mt-1">{{ currentDate }}</p>
          <div class="flex items-center mt-3 space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm text-sage-blue-100">Système opérationnel</span>
            </div>
            <div class="text-sm text-sage-blue-200">
              {{ filteredBaths.filter(b => b.status === 'active').length }}/{{ filteredBaths.length }} bains actifs
            </div>
            <div v-if="selectedChain !== 'all'" class="text-sm text-sage-blue-200 bg-white/10 px-2 py-1 rounded">
              {{ selectedChain }}
            </div>
          </div>
        </div>
        <div class="hidden lg:block">
          <div class="relative">
            <BarChart3 class="w-20 h-20 lg:w-24 lg:h-24 text-sage-blue-200" />
            <div class="absolute inset-0 flex items-center justify-center">
              <Zap class="w-8 h-8 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chain Filter -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center space-x-3">
          <Filter class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Filtrage par Chaîne</h3>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="chain in chains"
            :key="chain.id"
            @click="setSelectedChain(chain.id)"
            :class="`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedChain === chain.id
                ? 'bg-sage-blue-700 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`"
          >
            {{ chain.name }}
            <span class="ml-2 text-xs opacity-75">({{ getChainBathCount(chain.id) }})</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <MetricCard
        title="Bains Actifs"
        :value="filteredMetrics.activeBaths"
        icon="Zap"
        color="bg-green-500"
        trend="+2"
        trend-positive
        :subtitle="`${filteredMetrics.totalBaths} total`"
      />
      <MetricCard
        title="Pièces Traitées"
        :value="filteredMetrics.processedParts"
        icon="Package"
        color="bg-blue-500"
        trend="+15%"
        trend-positive
        subtitle="Aujourd'hui"
      />
      <MetricCard
        title="Qualité Moyenne"
        :value="filteredMetrics.averageQuality"
        icon="Award"
        color="bg-purple-500"
        trend="+2.1%"
        trend-positive
        subtitle="Conformité"
      />
      <MetricCard
        title="Alertes Actives"
        :value="filteredMetrics.activeAlerts"
        icon="AlertTriangle"
        color="bg-orange-500"
        trend="-3"
        trend-positive
        subtitle="Maintenance"
      />
    </div>

    <!-- Production Overview -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Production Chart -->
      <div class="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
            Production Journalière
            <span v-if="selectedChain !== 'all'" class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({{ getChainName(selectedChain) }})
            </span>
          </h3>
          <div class="flex items-center space-x-2">
            <select class="text-sm border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
              <option>3 derniers mois</option>
            </select>
            <button class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>
        <ProductionChart :chain-filter="selectedChain" />
      </div>

      <!-- Process Status -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          État des Processus
          <span v-if="selectedChain !== 'all'" class="text-sm font-normal text-gray-500 dark:text-gray-400 block">
            {{ getChainName(selectedChain) }}
          </span>
        </h3>
        <div class="space-y-4">
          <ProcessStatusItem
            v-for="process in filteredProcesses"
            :key="process.id"
            :process="process"
          />
        </div>
      </div>
    </div>

    <!-- Bath Monitoring -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
          Surveillance des Bains
          <span v-if="selectedChain !== 'all'" class="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
            ({{ filteredBaths.length }} bains - {{ getChainName(selectedChain) }})
          </span>
        </h3>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-500 dark:text-gray-400">Mise à jour: il y a 2 min</span>
          <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <BathMonitorCard
          v-for="bath in filteredBaths"
          :key="bath.id"
          :bath="bath"
        />
      </div>
      <div v-if="filteredBaths.length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
        Aucun bain trouvé pour la chaîne sélectionnée
      </div>
    </div>

    <!-- Quality & Alerts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quality Control -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Contrôle Qualité
          <span v-if="selectedChain !== 'all'" class="text-sm font-normal text-gray-500 dark:text-gray-400 block">
            {{ getChainName(selectedChain) }}
          </span>
        </h3>
        <div class="space-y-4">
          <QualityItem
            v-for="quality in filteredQualityData"
            :key="quality.id"
            :quality="quality"
          />
        </div>
      </div>

      <!-- Recent Alerts -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Alertes Récentes
          <span v-if="selectedChain !== 'all'" class="text-sm font-normal text-gray-500 dark:text-gray-400 block">
            {{ getChainName(selectedChain) }}
          </span>
        </h3>
        <div class="space-y-4">
          <AlertItem
            v-for="alert in filteredAlerts"
            :key="alert.id"
            :alert="alert"
          />
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activities -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activités Récentes</h3>
        <div class="space-y-4">
          <ActivityItem
            v-for="activity in recentActivities"
            :key="activity.id"
            :activity="activity"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-6">Actions Rapides</h3>
        <div class="space-y-3">
          <QuickActionButton
            v-for="action in quickActions"
            :key="action.id"
            :action="action"
            @click="handleQuickAction(action.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { BarChart3, Zap, RefreshCw, AlertTriangle, Filter } from 'lucide-vue-next'
import MetricCard from './MetricCard.vue'
import ProductionChart from './ProductionChart.vue'
import ProcessStatusItem from './ProcessStatusItem.vue'
import BathMonitorCard from './BathMonitorCard.vue'
import QualityItem from './QualityItem.vue'
import AlertItem from './AlertItem.vue'
import ActivityItem from './ActivityItem.vue'
import QuickActionButton from './QuickActionButton.vue'

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const selectedChain = ref('all')

const chains = ref([
  { id: 'all', name: 'Toutes les chaînes' },
  { id: 'CTS01', name: 'CTS01' },
  { id: 'CTS02', name: 'CTS02' },
  { id: 'CTS03', name: 'CTS03' },
  { id: 'CTS04', name: 'CTS04' }
])

const processes = ref([
  { id: 1, name: 'Dégraissage', status: 'active', progress: 85, color: 'bg-blue-500', chain: 'CTS01' },
  { id: 2, name: 'Décapage', status: 'active', progress: 92, color: 'bg-green-500', chain: 'CTS01' },
  { id: 3, name: 'Nickelage', status: 'warning', progress: 67, color: 'bg-yellow-500', chain: 'CTS02' },
  { id: 4, name: 'Chromage', status: 'active', progress: 78, color: 'bg-purple-500', chain: 'CTS02' },
  { id: 5, name: 'Rinçage Final', status: 'maintenance', progress: 0, color: 'bg-red-500', chain: 'CTS03' },
  { id: 6, name: 'Passivation', status: 'active', progress: 94, color: 'bg-indigo-500', chain: 'CTS03' },
  { id: 7, name: 'Séchage', status: 'active', progress: 88, color: 'bg-teal-500', chain: 'CTS04' }
])

const baths = ref([
  {
    id: 1,
    name: 'Bain Nickel #1',
    type: 'Nickelage',
    temperature: 52,
    ph: 4.2,
    concentration: 85,
    status: 'active',
    lastMaintenance: '2024-01-15',
    chain: 'CTS01'
  },
  {
    id: 2,
    name: 'Bain Chrome #2',
    type: 'Chromage',
    temperature: 48,
    ph: 3.8,
    concentration: 92,
    status: 'active',
    lastMaintenance: '2024-01-14',
    chain: 'CTS01'
  },
  {
    id: 3,
    name: 'Bain Cuivre #1',
    type: 'Cuivrage',
    temperature: 25,
    ph: 0.5,
    concentration: 78,
    status: 'warning',
    lastMaintenance: '2024-01-10',
    chain: 'CTS02'
  },
  {
    id: 4,
    name: 'Bain Zinc #3',
    type: 'Zingage',
    temperature: 22,
    ph: 6.2,
    concentration: 88,
    status: 'active',
    lastMaintenance: '2024-01-16',
    chain: 'CTS02'
  },
  {
    id: 5,
    name: 'Bain Argent #1',
    type: 'Argenture',
    temperature: 18,
    ph: 7.1,
    concentration: 65,
    status: 'maintenance',
    lastMaintenance: '2024-01-08',
    chain: 'CTS03'
  },
  {
    id: 6,
    name: 'Bain Or #1',
    type: 'Dorure',
    temperature: 65,
    ph: 4.5,
    concentration: 95,
    status: 'active',
    lastMaintenance: '2024-01-17',
    chain: 'CTS03'
  },
  {
    id: 7,
    name: 'Bain Étain #2',
    type: 'Étamage',
    temperature: 35,
    ph: 2.1,
    concentration: 82,
    status: 'active',
    lastMaintenance: '2024-01-16',
    chain: 'CTS04'
  },
  {
    id: 8,
    name: 'Bain Passivation #1',
    type: 'Passivation',
    temperature: 28,
    ph: 1.8,
    concentration: 90,
    status: 'active',
    lastMaintenance: '2024-01-15',
    chain: 'CTS04'
  }
])

const qualityData = ref([
  { id: 1, test: 'Adhérence', result: 98.5, target: 95, status: 'excellent', chain: 'CTS01' },
  { id: 2, test: 'Épaisseur', result: 94.2, target: 90, status: 'good', chain: 'CTS01' },
  { id: 3, test: 'Uniformité', result: 87.8, target: 90, status: 'warning', chain: 'CTS02' },
  { id: 4, test: 'Brillance', result: 96.1, target: 95, status: 'excellent', chain: 'CTS02' },
  { id: 5, test: 'Résistance', result: 92.3, target: 88, status: 'excellent', chain: 'CTS03' },
  { id: 6, test: 'Finition', result: 89.7, target: 92, status: 'warning', chain: 'CTS04' }
])

const recentAlerts = ref([
  { id: 1, type: 'warning', message: 'Température bain Chrome #2 élevée', time: 'Il y a 15 min', severity: 'medium', chain: 'CTS01' },
  { id: 2, type: 'maintenance', message: 'Maintenance programmée Bain Argent #1', time: 'Il y a 1h', severity: 'low', chain: 'CTS03' },
  { id: 3, type: 'error', message: 'Concentration faible Bain Cuivre #1', time: 'Il y a 2h', severity: 'high', chain: 'CTS02' },
  { id: 4, type: 'warning', message: 'pH instable Bain Étain #2', time: 'Il y a 3h', severity: 'medium', chain: 'CTS04' }
])

const recentActivities = ref([
  { id: 1, type: 'create', user: 'Marie Dubois', action: 'a démarré le traitement', item: 'Lot #2024-0156', time: 'Il y a 5 min' },
  { id: 2, type: 'update', user: 'Jean Martin', action: 'a ajusté la température du', item: 'Bain Nickel #1', time: 'Il y a 12 min' },
  { id: 3, type: 'approve', user: 'Sophie Laurent', action: 'a validé le contrôle qualité', item: 'Lot #2024-0155', time: 'Il y a 25 min' },
  { id: 4, type: 'create', user: 'Pierre Durand', action: 'a créé une nouvelle recette', item: 'Nickelage Brillant', time: 'Il y a 1h' },
  { id: 5, type: 'update', user: 'Anne Moreau', action: 'a effectué la maintenance du', item: 'Bain Chrome #2', time: 'Il y a 2h' }
])

const quickActions = ref([
  { id: 'new-batch', label: 'Nouveau Lot', icon: 'Package', color: 'bg-blue-500' },
  { id: 'quality-control', label: 'Contrôle Qualité', icon: 'Award', color: 'bg-green-500' },
  { id: 'maintenance', label: 'Maintenance', icon: 'Settings', color: 'bg-purple-500' },
  { id: 'bath-analysis', label: 'Analyse Bain', icon: 'Beaker', color: 'bg-orange-500' },
  { id: 'reports', label: 'Rapports', icon: 'BarChart3', color: 'bg-indigo-500' },
  { id: 'alerts', label: 'Alertes', icon: 'AlertTriangle', color: 'bg-red-500' }
])

// Computed properties for filtering
const filteredBaths = computed(() => {
  if (selectedChain.value === 'all') return baths.value
  return baths.value.filter(bath => bath.chain === selectedChain.value)
})

const filteredProcesses = computed(() => {
  if (selectedChain.value === 'all') return processes.value
  return processes.value.filter(process => process.chain === selectedChain.value)
})

const filteredQualityData = computed(() => {
  if (selectedChain.value === 'all') return qualityData.value
  return qualityData.value.filter(quality => quality.chain === selectedChain.value)
})

const filteredAlerts = computed(() => {
  if (selectedChain.value === 'all') return recentAlerts.value
  return recentAlerts.value.filter(alert => alert.chain === selectedChain.value)
})

const filteredMetrics = computed(() => {
  const filtered = filteredBaths.value
  const activeBaths = filtered.filter(b => b.status === 'active').length
  const totalBaths = filtered.length
  
  // Calcul des métriques basées sur la chaîne sélectionnée
  const baseProcessed = selectedChain.value === 'all' ? 847 : Math.floor(847 / 4) // Répartition approximative
  const baseQuality = selectedChain.value === 'all' ? 98.2 : 
    filteredQualityData.value.length > 0 ? 
    (filteredQualityData.value.reduce((sum, q) => sum + q.result, 0) / filteredQualityData.value.length).toFixed(1) : 
    98.2
  const activeAlerts = filteredAlerts.value.length
  
  return {
    activeBaths: activeBaths.toString(),
    totalBaths: totalBaths.toString(),
    processedParts: baseProcessed.toString(),
    averageQuality: `${baseQuality}%`,
    activeAlerts: activeAlerts.toString()
  }
})

// Methods
const setSelectedChain = (chainId) => {
  selectedChain.value = chainId
}

const getChainName = (chainId) => {
  const chain = chains.value.find(c => c.id === chainId)
  return chain ? chain.name : chainId
}

const getChainBathCount = (chainId) => {
  if (chainId === 'all') return baths.value.length
  return baths.value.filter(bath => bath.chain === chainId).length
}

const handleQuickAction = (actionId) => {
  console.log(`Quick action: ${actionId}`)
}
</script>