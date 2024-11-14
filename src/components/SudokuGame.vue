<script setup lang="ts">
import SudokuBoard from '@/components/SudokuBoard.vue'
import SudokuInfos from '@/components/SudokuInfos.vue'
import solveBoard from '@/Solver'

import { state } from '@/store/sudokuStore'

function handleRestart() {
  console.log('restart')
}
function handleNew() {
  console.log(state.board)
  console.log('new')
}
function handleValidate() {
  // solveBoard()
  console.log('validate')
}
</script>

<template>
  <div class="sudoku">
    <SudokuInfos @restart="handleRestart" @new="handleNew" @validate="handleValidate" />
    <SudokuBoard />
  </div>
</template>

<style scoped>
.sudoku {
  width: 80vh;
  height: 80vh;
  margin: 0 auto;
}
</style>
