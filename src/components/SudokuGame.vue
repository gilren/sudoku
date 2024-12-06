<script setup lang="ts">
import SudokuBoard from '@/components/SudokuBoard.vue'
import SudokuControls from '@/components/SudokuControls.vue'
import GameAlert from './GameAlert.vue'
import { useGameStore } from '@/store/game'
import { ref, watch } from 'vue'

const store = useGameStore()
const showAlert = ref(false)

watch(
  () => store.status,
  (newstatus) => {
    if (newstatus === 'solved') {
      showAlert.value = true
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="sudoku">
    <SudokuControls />
    <SudokuBoard />
    <GameAlert :show="showAlert" />
  </div>
</template>

<style scoped>
.sudoku {
  width: min(100vw - 40px, 80vh);
}

@container (min-width: 600px) {
  .sudoku {
    height: 80%;
  }
}
</style>
