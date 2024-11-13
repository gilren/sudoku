<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  value: number
  index: number
}>()

const isDefault = props.value !== 0
</script>

<template>
  <div class="cell" :class="{ 'cell-default': isDefault }">
    <div class="number-container">
      <template v-if="isDefault">
        {{ props.value }}
      </template>
    </div>
    <div class="helper">
      <!-- {{ props.index }} -->
    </div>
  </div>
</template>

<style scoped>
.cell {
  border: 1px solid rgba(152, 158, 162, 0.2);
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  box-sizing: border-box;
}

.cell.cell-default {
  color: #989ea2;
  background: rgb(132, 140, 143, 0.2);
}

.cell.cell--invalid {
  color: rgb(255, 250, 160);
  background: rgb(255, 250, 160, 0.2);
}

.number-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 2.5em;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1;
  bottom: 0;
  opacity: 1;
  transition: opacity 250ms ease-out;
}

.helper {
  pointer-events: none;
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 12px;
  color: tomato;
}
</style>
