<script setup lang="ts">
import { defineProps, ref, watch, type Ref } from 'vue'
import SudokuMarker from '@/components/SudokuMarker.vue'

import { useGameStore } from '@/store/game'

const store = useGameStore()

import type { Coords } from '@/utils/types'

const props = defineProps<{
  value: number
  index: number
  coords: Coords
}>()

const isDefault = props.value !== 0

const currentValue = ref(props.value)

const hasMarkers = ref(false)

function handleUpdate(markers: Ref<Set<number>>) {
  hasMarkers.value = markers.value.size > 1

  const newValue = markers.value.size === 1 ? Array.from(markers.value)[0] : 0

  currentValue.value = newValue
}

// Sync local state with store on value change
watch(
  () => props.value,
  (newValue) => {
    currentValue.value = newValue
  },
  { immediate: true },
)

// Propagate local state to store
watch(currentValue, (newValue) => {
  if (newValue !== props.value) {
    store.updateCell(props.coords.x, props.coords.y, newValue)
  }
})
</script>

<template>
  <div class="cell" :class="{ 'cell--default': isDefault, 'has-markers': hasMarkers }">
    <!-- {{ currentValue }} -->
    <div class="number-container">
      {{ currentValue !== 0 ? currentValue : '' }}
    </div>
    <div class="helper">
      <!-- {{ props.index }} -->
      <!-- {{ props.coords }} -->
    </div>

    <SudokuMarker v-if="!isDefault" @update="handleUpdate" />
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

.cell.cell--default {
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

.cell:not(.cell--default):hover {
  background: rgba(255, 255, 255, 0.01);
}

.cell:not(.cell--default):hover .number-container,
.cell:not(.cell--default) .marker-container,
.cell:not(.has-markers) .marker-container {
  opacity: 0;
}

.cell:not(.cell--default):hover .marker-container,
.cell.has-markers .marker-container {
  opacity: 1;
}
</style>
