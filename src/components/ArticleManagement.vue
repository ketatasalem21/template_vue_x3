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
        />
      </template>
      <template #right>
        <MainContent 
          :article="selectedArticle"
          :articles="sampleArticles"
          @select-article="setSelectedArticle"
        />
      </template>
    </AppSplitter>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import MainContent from './MainContent.vue'
import AppSplitter from './AppSplitter.vue'

const sampleArticles = [
  {
    id: '0101A01-1',
    designation: 'RESERVATION1 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable'
  },
  {
    id: '0101A01-2',
    designation: 'RESERVATION2 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable'
  },
  {
    id: '0101A01-3',
    designation: 'RESERVATION3 OPS 05 06 07 08 09 10',
    category: 'FAB',
    status: 'Non utilisable'
  },
  {
    id: '0101A01-4',
    designation: 'Article Omar',
    category: 'FAB',
    status: 'Acheté'
  },
  {
    id: '0102A01-1',
    designation: 'MINI VANNE BS 1/2" MF NICKELEE PAPILLON ROUGE',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0103A03-1',
    designation: 'VANNE BS 1/2" MM PAPILLON ROUGE',
    category: 'FPV',
    status: 'Acheté'
  },
  {
    id: '0104A02-1',
    designation: 'VANNE BS 1/2" MM LEVIER ROUGE',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0105A03-1',
    designation: 'VBS 3/4" MM QL 16+LEVIER BLEU',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0106A01-1',
    designation: 'RACCORD LAITON 1/2" MF',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0107A02-1',
    designation: 'JOINT TORIQUE 15MM',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0108A01-1',
    designation: 'TUBE CUIVRE 12MM',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0109A01-1',
    designation: 'COUDE PVC 90° 20MM',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0110A01-1',
    designation: 'MANCHON REDUCTION 25/20MM',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0111A01-1',
    designation: 'CLAPET ANTI-RETOUR 1/2"',
    category: 'FAV',
    status: 'Acheté'
  },
  {
    id: '0112A01-1',
    designation: 'FILTRE A EAU 3/4"',
    category: 'FAV',
    status: 'Acheté'
  }
]

const selectedArticle = ref(sampleArticles[0])
const showRightOnMobile = ref(false)

const setSelectedArticle = (article) => {
  selectedArticle.value = article
}

const setShowRightOnMobile = (value) => {
  showRightOnMobile.value = value
}
</script>