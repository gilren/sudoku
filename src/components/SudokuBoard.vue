<script setup lang="ts">
import SudokuCell from '@/components/SudokuCell.vue'
import { computed, onMounted, ref } from 'vue'
import { useGameStore } from '@/store/game'

const store = useGameStore()

const flattenedBoard = computed(() => store.getFlattenedBoard)

console.log(flattenedBoard)
</script>

<template>
  <div v-if="store.loading" class="loading">Loading...</div>
  <div v-else class="sudoku__grid">
    <SudokuCell
      v-for="cell in flattenedBoard"
      :key="cell.index"
      :value="cell.value"
      :index="cell.index"
      :coords="cell.coords"
    />
  </div>
</template>

<style scoped>
.sudoku__grid {
  width: 100%;
  height: 100%;
  border: 2px solid #989ea2;
  user-select: none;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
}

.sudoku__grid .cell:nth-child(9n + 3),
.sudoku__grid .cell:nth-child(9n + 6) {
  border-right-color: rgba(152, 158, 162, 1);
}

.sudoku__grid .cell:nth-child(19),
.sudoku__grid .cell:nth-child(20),
.sudoku__grid .cell:nth-child(21),
.sudoku__grid .cell:nth-child(22),
.sudoku__grid .cell:nth-child(23),
.sudoku__grid .cell:nth-child(24),
.sudoku__grid .cell:nth-child(25),
.sudoku__grid .cell:nth-child(26),
.sudoku__grid .cell:nth-child(27),
.sudoku__grid .cell:nth-child(46),
.sudoku__grid .cell:nth-child(47),
.sudoku__grid .cell:nth-child(48),
.sudoku__grid .cell:nth-child(49),
.sudoku__grid .cell:nth-child(50),
.sudoku__grid .cell:nth-child(51),
.sudoku__grid .cell:nth-child(52),
.sudoku__grid .cell:nth-child(53),
.sudoku__grid .cell:nth-child(54) {
  border-bottom-color: rgba(152, 158, 162, 1);
}
</style>
