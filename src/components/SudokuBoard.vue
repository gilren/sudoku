<script setup lang="ts">
import SudokuCell from '@/components/SudokuCell.vue'
import { computed, onMounted } from 'vue'

import { state } from '@/store/sudokuStore'

onMounted(async () => {
  try {
    state.board = (await import(`../../sudokus/easy.json`)).default[0]
  } catch (e) {
    throw e
  }
})

const flattenedSudoku = computed(() =>
  state.board.flatMap((col, colIdx) =>
    col.map((row, rowIdx) => ({
      value: row as number,
      index: (colIdx * state.board[0].length + rowIdx) as number,
      coords: { x: rowIdx, y: colIdx },
    })),
  ),
)
</script>

<template>
  <div class="sudoku__grid">
    <SudokuCell
      v-for="cell in flattenedSudoku"
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
