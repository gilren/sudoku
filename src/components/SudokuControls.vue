<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/store/game'
import SudokuTimer from '@/components/SudokuTimer.vue'
import { DIFFICULTIES } from '@/types'

const store = useGameStore()

const currentDifficulty = ref(store.getDifficulty)
const timerKey = ref(0)

function changeDifficulty() {
  store.setDifficulty(currentDifficulty.value)
  store.newGame()
  restartTimer()
}

function handleRestart() {
  restartTimer()
  store.restartGame()
}

function handleNew() {
  restartTimer()
  store.newGame()
}

function handleValidate() {
  store.validate()
}

function restartTimer() {
  timerKey.value++
}
</script>

<template>
  <div class="sudoku__controls">
    <SudokuTimer :restartKey="timerKey" />
    <div class="sudoku__actions">
      <select name="difficulty" v-model="currentDifficulty" @change="changeDifficulty">
        <option v-for="option in DIFFICULTIES" :value="option" :key="option">
          {{ option[0]!.toUpperCase() + option.slice(1) }}
        </option>
      </select>
      <button class="btn" @click="handleRestart">Restart</button>
      <button class="btn" @click="handleNew">New</button>
      <button class="btn btn-validate" @click="handleValidate">Validate</button>
    </div>
  </div>
</template>

<style scoped>
.sudoku__actions {
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  container-type: inline-size;
}

.btn-validate {
  background-color: var(--olivine);
}

@container (min-width:600px) {
  .sudoku__actions {
    padding: 0;
  }

  .btn,
  select {
    font-size: 18px;
    padding: 0.75em 1.75em;
  }

  select {
    padding: 0.75em 1em;
  }
}
</style>
