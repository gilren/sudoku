<script setup lang="ts">
import SudokuBoard from '@/components/SudokuBoard.vue'
import SudokuInfos from '@/components/SudokuInfos.vue'
import solveBoard from '@/Solver'

import { useSudokuStore } from '@/store/sudokuStore'
import { computed, onMounted, ref } from 'vue'

const { state, loadBoard, getFlattenedBoard } = useSudokuStore()

function handleRestart() {
  console.log('restart')
}
function handleNew() {
  console.log('HANDLE NEW')
  console.log(state.board)
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
