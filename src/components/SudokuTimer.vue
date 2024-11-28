<script setup lang="ts">
import { timeToText } from '@/utils/utils'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  restartKey: {
    type: Number,
    required: true,
  },
})

const timerInterval = ref()
const timerValue = ref('')

function startTimer() {
  stopTimer()
  console.log('Starting timer')
  const startTime = new Date().getTime()

  const updateTimer = () => {
    const now = new Date().getTime()
    const elapsedTime = now - startTime

    timerValue.value = timeToText(elapsedTime)
  }

  timerInterval.value = setInterval(updateTimer, 1000)
  updateTimer()
}

function stopTimer() {
  console.log('Stopping timer')
  clearInterval(timerInterval.value)
  timerValue.value = ''
}

watch(() => props.restartKey, startTimer)

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  stopTimer()
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
  margin-bottom: 2rem;
}

.timer {
  font-size: 2rem;
}
</style>
