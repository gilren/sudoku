<script setup lang="ts">
import {
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from '@/utils/types'
import { onMounted, onUnmounted, ref } from 'vue'

const selectedDifficulty = ref(DIFFICULTY_EASY)
const emit = defineEmits(['restart', 'validate', 'new'])

const timerInterval = ref()
const timerValue = ref('')

const difficulties = ref([
  DIFFICULTY_EASY,
  DIFFICULTY_MEDIUM,
  DIFFICULTY_HARD,
  DIFFICULTY_EXPERT,
  DIFFICULTY_MASTER,
])

function startTimer() {
  const startTime = new Date().getTime()

  const updateTimer = () => {
    const now = new Date().getTime()
    const elapsedTime = now - startTime
    const seconds = Math.floor((elapsedTime / 1000) % 60)
    const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60)
    const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)

    let text = ''
    if (hours > 0) text += `${hours}H `
    if (minutes > 0) text += `${minutes}M `
    text += `${seconds}S`
    timerValue.value = text
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
  const storedDifficulty = localStorage.getItem('difficulty')
  if (storedDifficulty) {
    selectedDifficulty.value = storedDifficulty
  }

  startTimer()
})

onUnmounted(() => {
  clearTimer()
  timerValue.value = ''
})

function handleChange() {
  localStorage.setItem('difficulty', selectedDifficulty.value)
  restartTimer()
  emit('new')
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
    <select name="difficulty" v-model="selectedDifficulty" @change="handleChange">
      <option v-for="option in difficulties" :value="option" :key="option">
        {{ option[0].toUpperCase() + option.slice(1) }}
      </option>
    </select>
    <button class="btn" @click="handleRestart">Restart</button>
    <button class="btn" @click="$emit('validate')">Validate</button>
    <button class="btn" @click="handleNew">New</button>
    <div class="timer">{{ timerValue }}</div>
  </div>
</template>

<style scoped>
.sudoku__infos {
  margin-bottom: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

select {
  display: inline-block;
  border: 1px solid rgb(132, 140, 143, 0.3);
  background: #1b2023;
  color: #989ea2;
  font-size: 18px;
  padding: 0.75em 1em;
  cursor: pointer;
  transition: all 250ms ease-in-out;
}

.btn {
  display: inline-block;
  border: 1px solid rgb(132, 140, 143, 0.3);
  background: transparent;
  color: #989ea2;
  font-size: 18px;
  padding: 0.75em 1.75em;
  cursor: pointer;
  transition: all 250ms ease-out;
}

.btn:hover {
  border-color: rgb(132, 140, 143, 0.8);
  background: rgb(132, 140, 143, 0.05);
}
</style>
