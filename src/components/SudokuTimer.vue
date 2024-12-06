<script setup lang="ts">
import { useGameStore } from '@/store/game'
import { timeToText } from '@/utils/utils'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const store = useGameStore()

const props = defineProps({
  restartKey: {
    type: Number,
    required: true,
  },
})

const timerValue = ref('')
let timerInterval: ReturnType<typeof setInterval> | null = null
let elapsedTime = 0
let lastStartTime = 0

function startTimer() {
  lastStartTime = new Date().getTime()

  timerValue.value = timeToText(elapsedTime)

  timerInterval = setInterval(() => {
    const now = new Date().getTime()
    timerValue.value = timeToText(elapsedTime + (now - lastStartTime))
  }, 1000)
}

function pauseTimer() {
  if (timerInterval) {
    elapsedTime += Date.now() - lastStartTime
    clearTimer()
  }
}

function clearTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

watch(
  () => props.restartKey,
  () => {
    elapsedTime = 0
    startTimer()
  },
)

watch(
  () => store.status,
  (newstatus) => {
    if (newstatus === 'solved') {
      clearTimer()
    }
  },
  { immediate: true },
)

function handleWindowVisibility() {
  if (store.status === 'solved') return
  if (document.hidden) {
    pauseTimer()
  } else {
    startTimer()
  }
}

onMounted(() => {
  document.addEventListener('visibilitychange', handleWindowVisibility)
  startTimer()
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleWindowVisibility)
  clearTimer()
})
</script>

<template>
  <div class="sudoku__timer">
    <span class="timer">{{ timerValue }}</span>
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
