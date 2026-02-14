<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameStore } from '@/store/game'
import { timeToText } from '@/lib/utils'

const props = defineProps({
  restartKey: {
    type: Number,
    required: true,
  },
})

const store = useGameStore()
const timerText = ref('')
let timerInterval: number | null = null
let elapsedTime = 0
let lastStartTime = 0

const updateTimer = () => {
  timerText.value = timeToText(elapsedTime + (Date.now() - lastStartTime))
}

function startTimer() {
  if (timerInterval) return
  lastStartTime = Date.now()
  timerText.value = timeToText(elapsedTime)
  timerInterval = setInterval(updateTimer, 1000)
}

function pauseTimer() {
  if (!timerInterval) return
  elapsedTime += Date.now() - lastStartTime
  clearInterval(timerInterval)
  timerInterval = null
  timerText.value = timeToText(elapsedTime)
}

function resetTimer() {
  elapsedTime = 0
  startTimer()
}

function handleVisibilityChange() {
  if (store.status === 'solved') return
  document.hidden ? pauseTimer() : startTimer()
}

watch(() => props.restartKey, resetTimer)

watch(
  () => store.status,
  (status) => {
    if (status === 'solved') pauseTimer()
  },
  { immediate: true },
)

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
  if (store.status !== 'solved') startTimer()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  pauseTimer()
})
</script>

<template>
  <div class="sudoku__timer">
    <span class="timer">{{ timerText }}</span>
  </div>
</template>

<style scoped>
.sudoku__timer {
  text-align: center;
  margin-bottom: 1.5rem;

  container-type: inline-size;
}

.timer {
  font-size: 1.5rem;
}

@container (min-width: 600px) {
  .sudoku__timer {
    margin-bottom: 2rem;
  }

  .timer {
    font-size: 2rem;
  }
}
</style>
