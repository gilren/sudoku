<script setup lang="ts">
import { Difficulty } from '@/utils/types'

import { onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '@/store/game'
import { timeToText } from '@/utils/utils'

const store = useGameStore()
const currentDifficulty = ref(store.getDifficulty)

const emit = defineEmits(['restart', 'validate', 'new'])

const timerInterval = ref()
const timerValue = ref('')

const difficulties = ref(Difficulty)

function startTimer() {
  const startTime = new Date().getTime()

  const updateTimer = () => {
    const now = new Date().getTime()
    const elapsedTime = now - startTime

    timerValue.value = timeToText(elapsedTime)
  }

  timerInterval.value = setInterval(updateTimer, 1000)
  updateTimer()
}

function clearTimer() {
  clearInterval(timerInterval.value)
}

function restartTimer() {
  clearTimer()
  startTimer()
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearTimer()
  timerValue.value = ''
})

function changeDifficulty() {
  store.setDifficulty(currentDifficulty.value)
  store.loadBoard()
  restartTimer()
}

function handleRestart() {
  restartTimer()
  emit('restart')
}

function handleNew() {
  restartTimer()
  emit('new')
}
</script>

<template>
  <div class="sudoku__infos">
    <div class="sudoku__timer">
      <span class="timer">{{ timerValue }}</span>
    </div>
    <div class="sudoku__actions">
      <select name="difficulty" v-model="currentDifficulty" @change="changeDifficulty">
        <option v-for="option in difficulties" :value="option" :key="option">
          {{ option[0].toUpperCase() + option.slice(1) }}
        </option>
      </select>
      <button class="btn" @click="handleRestart">Restart</button>
      <button class="btn" @click="handleNew">New</button>
      <button class="btn" @click="$emit('validate')">Validate</button>
    </div>
  </div>
</template>

<style scoped>
.sudoku__timer {
  text-align: center;
  margin-bottom: 2rem;
}

.timer {
  font-size: 2rem;
}

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
