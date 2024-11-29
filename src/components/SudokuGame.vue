<script setup lang="ts">
import SudokuBoard from '@/components/SudokuBoard.vue'
import SudokuControls from '@/components/SudokuControls.vue'
</script>

<template>
  <div class="sudoku">
    <SudokuControls />
    <SudokuBoard />
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
