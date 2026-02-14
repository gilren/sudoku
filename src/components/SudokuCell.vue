<script setup lang="ts">
import { type ComponentPublicInstance, computed, ref, watch } from 'vue'
import { useGameStore } from '@/store/game'
import SudokuMarker from '@/components/SudokuMarker.vue'
import type { Coords } from '@/types'

const props = defineProps<{
  value: number
  index: number
  coords: Coords
}>()

const store = useGameStore()

const markers = ref<ComponentPublicInstance<typeof SudokuMarker>>()
const currentValue = ref(props.value)
const hasMultipleMarkers = ref(false)
const isInvalid = ref(false)

const isDefault = props.value !== 0
const storeMarkers = computed(() => store.getMarkersForCell(props.coords.y, props.coords.x))

function handleUpdate(updatedMarkers: Set<number> | null) {
  hasMultipleMarkers.value = updatedMarkers ? updatedMarkers.size > 1 : false

  let newValue = 0
  if (updatedMarkers && updatedMarkers.size === 1) {
    newValue = updatedMarkers.values().next().value!
  }

  store.updateCell(props.coords.x, props.coords.y, newValue, updatedMarkers)
}

function clean() {
  if (markers.value) {
    markers.value.clean()
  }
}

function sendKey(key: number) {
  if (markers.value) {
    markers.value.sendKey(key)
  }
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

store.$onAction(({ name, after }) => {
  if (name === 'validate') {
    after(() => {
      if (isDefault || currentValue.value === 0) {
        isInvalid.value = false
        return
      }
      isInvalid.value = store.solution![props.coords.y]![props.coords.x] !== currentValue.value
    })
  }
})

defineExpose({
  clean,
  sendKey,
})
</script>

<template>
  <div
    class="cell"
    :class="{
      'cell--default': isDefault,
      'has-markers': hasMultipleMarkers,
      'cell--invalid': isInvalid,
    }"
  >
    <!-- {{ currentValue }} -->
    <div class="number-container">
      {{ currentValue !== 0 ? currentValue : '' }}
    </div>
    <div class="helper">
      <!-- {{ props.index }}
      {{ props.coords }} -->
    </div>

    <SudokuMarker v-if="!isDefault" :markers="storeMarkers" @update="handleUpdate" ref="markers" />
  </div>
</template>

<style scoped>
.cell {
  border: 1px solid color-mix(in srgb, var(--blue-violet) 20%, transparent);
  font-size: 14px;
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
    transparent 5px,
    rgba(0, 0, 0, 0.18) 5px,
    rgba(0, 0, 0, 0.18) 10px
  );
}

.cell.cell--invalid {
  background-color: var(--rajah);
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
    font-size: 1.5em;
  }

  .cell.cell--default {
    background: repeating-linear-gradient(
      55deg,
      transparent,
      transparent 10px,
      rgba(0, 0, 0, 0.18) 10px,
      rgba(0, 0, 0, 0.18) 20px
    );
  }
}

@container (min-width: 800px) {
  .cell {
    font-size: 2em;
  }
}
</style>
