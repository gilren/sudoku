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
  height: 80vh;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  container-type: inline-size;
}

@container (min-width: 600px) {
  .sudoku {
    width: 80vh;
    height: 80%;
  }
}
</style>
