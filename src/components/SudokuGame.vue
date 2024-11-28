<script setup lang="ts">
import SudokuBoard from '@/components/SudokuBoard.vue'
import SudokuControls from '@/components/SudokuControls.vue'
import { useGameStore } from '@/store/game'
import { onMounted } from 'vue'

const store = useGameStore()
onMounted(() => {
  store.loadBoard()
})
</script>

<template>
  <div class="sudoku">
    <SudokuControls />
    <SudokuBoard />
  </div>
</template>

<style scoped>
.sudoku {
  width: 80vh;
  height: 80%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
