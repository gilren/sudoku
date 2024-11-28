<script setup lang="ts">
import { Difficulty } from '@/utils/types'
import SudokuTimer from '@/components/SudokuTimer.vue'

import { ref } from 'vue'
import { useGameStore } from '@/store/game'

const store = useGameStore()
const currentDifficulty = ref(store.getDifficulty)

const timerKey = ref(0)

const difficulties = ref(Difficulty)

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
        <option v-for="option in difficulties" :value="option" :key="option">
          {{ option[0].toUpperCase() + option.slice(1) }}
        </option>
      </select>
      <button class="btn" @click="handleRestart">Restart</button>
      <button class="btn" @click="handleNew">New</button>
      <button class="btn" @click="handleValidate">Validate</button>
    </div>
  </div>
</template>

<style scoped>
.sudoku__actions {
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

select {
  display: inline-block;
  border: none;
  background: var(--blue-violet);
  color: var(--whisper);
  font-size: 18px;
  padding: 0.75em 1em;
  cursor: pointer;
  transition: all 250ms ease-in-out;
  border-radius: 5px;
}

.btn {
  display: inline-block;
  border: none;
  background: transparent;
  color: var(--whisper);
  background: var(--blue-violet);
  font-size: 18px;
  padding: 0.75em 1.75em;
  cursor: pointer;
  transition: all 250ms ease-out;
  border-radius: 5px;
}

.btn:hover {
  background: var(--cranberry);
}
</style>
