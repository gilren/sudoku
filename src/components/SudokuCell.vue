<script setup lang="ts">
import { defineProps, ref, watch, type ComponentPublicInstance } from 'vue'
import SudokuMarker from '@/components/SudokuMarker.vue'

import { useGameStore } from '@/store/game'
import type { Coords } from '@/utils/types'

const store = useGameStore()

const props = defineProps<{
  value: number
  index: number
  coords: Coords
}>()

const isDefault = props.value !== 0

const markers = ref<ComponentPublicInstance<typeof SudokuMarker>>()

const currentValue = ref(props.value)

const hasMarkers = ref(false)
const isInvalid = ref(false)

function sendKey(key: number) {
  if (markers.value) {
    markers.value.sendKey(key)
  }
}

defineExpose({
  sendKey,
})

function handleUpdate(updatedMarkers: Set<number>) {
  hasMarkers.value = updatedMarkers.size > 1
  const newValue = updatedMarkers.size === 1 ? Array.from(updatedMarkers)[0] : 0
  currentValue.value = newValue

  store.updateCell(props.coords.x, props.coords.y, newValue, updatedMarkers)
}

watch(
  () => props.value,
  (newValue) => {
    currentValue.value = newValue
    if (newValue === 0) {
      isInvalid.value = false
    }
  },
  { immediate: true },
)

watch(
  () => store.markers[props.coords.y][props.coords.x],
  (newMarkers) => {
    hasMarkers.value = newMarkers.size > 1
  },
  { immediate: true },
)

store.$onAction(({ name, after }) => {
  if (name === 'validate') {
    after(() => {
      if (isDefault || currentValue.value === 0) return
      if (store.solution![props.coords.y][props.coords.x] !== currentValue.value) {
        isInvalid.value = true
      }
    })
  }
})
</script>

<template>
  <div
    class="cell"
    :class="{ 'cell--default': isDefault, 'has-markers': hasMarkers, 'cell--invalid': isInvalid }"
  >
    <!-- {{ currentValue }} -->
    <div class="number-container">
      {{ currentValue !== 0 ? currentValue : '' }}
    </div>
    <div class="helper">
      <!-- {{ props.index }}
      {{ props.coords }} -->
    </div>

    <SudokuMarker
      v-if="!isDefault"
      :markers="store.markers[props.coords.y][props.coords.x]"
      @update="handleUpdate"
      ref="markers"
    />
  </div>
</template>

<style scoped>
.cell {
  border: 1px solid color-mix(in srgb, var(--blue-violet) 20%, transparent);
  font-size: 20px;
  text-align: center;
  font-weight: 700;
  position: relative;
  box-sizing: border-box;
  transition:
    background-color 250ms ease-in-out,
    color 250ms ease-in-out;
}

.cell.cell--default {
  color: var(--whisper);

  background: repeating-linear-gradient(
    55deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.18) 10px,
    rgba(0, 0, 0, 0.18) 20px
  );
}

.cell.cell--invalid {
  background: var(--rajah);
}

.number-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.5em;
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
@container (min-width: 600px) {
  .cell {
    font-size: 1.75em;
  }
}

@container (min-width: 800px) {
  .cell {
    font-size: 2em;
  }
}
</style>
