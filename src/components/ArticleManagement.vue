<template>
  <div class="h-[calc(100vh-64px)]">
    <AppSplitter 
      :initial-split-percentage="25" 
      :min-left-width="250" 
      :min-right-width="500"
      :show-right-on-mobile="showRightOnMobile"
      @mobile-toggle="setShowRightOnMobile"
    >
      <template #left>
        <AppSidebar 
          :articles="sampleArticles"
          :selected-article="selectedArticle"
          @select-article="setSelectedArticle"
          @toggle-mobile-view="toggleMobileView"
        />
      </template>
      <template #right>
        <MainContent 
          :article="selectedArticle"
          :articles="sampleArticles"
          @select-article="setSelectedArticle"
          @toggle-mobile-view="toggleMobileView"
        />
      </template>
    </AppSplitter>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, inject } from 'vue'
import AppSplitter from './AppSplitter.vue'
import AppSidebar from './AppSidebar.vue'
import MainContent from './MainContent.vue'

const sampleArticles = [
  {
    id: '0101A01-1',
    designation: 'RESERVATION1 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable',
    title: 'RESERVATION1 OPS 05 06 07 08 09 10',
    description: 'Article de réservation FAB',
    createdAt: '2024-01-15'
  },
  {
    id: '0101A01-2',
    designation: 'RESERVATION2 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable',
    title: 'RESERVATION2 OPS 05 06 07 08 09 10',
    description: 'Article de réservation FAB',
    createdAt: '2024-01-16'
  },
  {
    id: '0101A01-3',
    designation: 'RESERVATION3 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable',
    title: 'RESERVATION3 OPS 05 06 07 08 09 10',
    description: 'Article de réservation FAB',
    createdAt: '2024-01-17'
  },
  {
    id: '0101A01-4',
    designation: 'Article Omar',
    category: 'FAB',
    status: 'Acheté',
    title: 'Article Omar',
    description: 'Article spécial Omar',
    createdAt: '2024-01-18'
  },
  {
    id: '0102A01-1',
    designation: 'MINI VANNE BS 1/2" MF NICKELEE PAPILLON ROUGE',
    category: 'FAV',
    status: 'Acheté',
    title: 'MINI VANNE BS 1/2" MF NICKELEE',
    description: 'Vanne papillon rouge nickelée',
    createdAt: '2024-01-19'
  },
  {
    id: '0103A03-1',
    designation: 'VANNE BS 1/2" MM PAPILLON ROUGE',
    category: 'FPV',
    status: 'Acheté',
    title: 'VANNE BS 1/2" MM PAPILLON',
    description: 'Vanne papillon rouge standard',
    createdAt: '2024-01-20'
  },
  {
    id: '0104A02-1',
    designation: 'VANNE BS 1/2" MM LEVIER ROUGE',
    category: 'FAV',
    status: 'Acheté',
    title: 'VANNE BS 1/2" MM LEVIER',
    description: 'Vanne à levier rouge',
    createdAt: '2024-01-21'
  },
  {
    id: '0105A03-1',
    designation: 'VBS 3/4" MM QL 16+LEVIER BLEU',
    category: 'FAV',
    status: 'Acheté',
    title: 'VBS 3/4" MM QL 16+LEVIER',
    description: 'Vanne à levier bleu 3/4"',
    createdAt: '2024-01-22'
  },
  {
    id: '0106A01-1',
    designation: 'RACCORD LAITON 1/2" MF',
    category: 'FAV',
    status: 'Acheté',
    title: 'RACCORD LAITON 1/2" MF',
    description: 'Raccord en laiton mâle-femelle',
    createdAt: '2024-01-23'
  },
  {
    id: '0107A02-1',
    designation: 'JOINT TORIQUE 15MM',
    category: 'FAV',
    status: 'Acheté',
    title: 'JOINT TORIQUE 15MM',
    description: 'Joint d\'étanchéité torique',
    createdAt: '2024-01-24'
  }
]

const selectedArticle = ref(sampleArticles[0])
const showRightOnMobile = ref(false)

// Inject the header control functions
const headerControls = inject('headerControls', null)

const setSelectedArticle = (article) => {
  selectedArticle.value = article
}

const setShowRightOnMobile = (value) => {
  showRightOnMobile.value = value
  // Update header state
  if (headerControls) {
    headerControls.setShowingList(!value)
  }
}

const toggleMobileView = () => {
  showRightOnMobile.value = !showRightOnMobile.value
  // Update header state
  if (headerControls) {
    headerControls.setShowingList(!showRightOnMobile.value)
  }
}

onMounted(() => {
  // Enable mobile toggle in header when this component is mounted
  if (headerControls) {
    headerControls.setShowMobileToggle(true)
    headerControls.setShowingList(true)
    headerControls.onToggleMobileView.value = toggleMobileView
  }
})

onUnmounted(() => {
  // Disable mobile toggle in header when this component is unmounted
  if (headerControls) {
    headerControls.setShowMobileToggle(false)
    headerControls.onToggleMobileView.value = null
  }
})
</script>