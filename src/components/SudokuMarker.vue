<script setup lang="ts">
import { useTemplateRef } from 'vue'

const props = defineProps<{
  markers: Set<number> | null
}>()

const emit = defineEmits<{
  (e: 'update', value: Set<number> | null): void
}>()

const markersRef = useTemplateRef('marker')

function handleClick(e: PointerEvent) {
  e.preventDefault()
  if (!(e.target instanceof HTMLButtonElement) || !markersRef.value) return
  const value = markersRef.value.indexOf(e.target) + 1

  updateMarker(value)
}

function updateMarker(value: number) {
  let nextMarkers: Set<number>

  if (!props.markers) {
    nextMarkers = new Set()
  } else {
    nextMarkers = new Set(props.markers)
  }

  nextMarkers.has(value) ? nextMarkers.delete(value) : nextMarkers.add(value)

  emit('update', nextMarkers)
}

function clean() {
  emit('update', null)
}

function sendKey(key: number) {
  updateMarker(Number(key))
}

function isMarkerActive(marker: number) {
  return props.markers?.has(marker) ?? false
}

defineExpose({
  clean,
  sendKey,
})
</script>

<template>
  <div class="marker-container" @click="handleClick">
    <button
      v-for="n in 9"
      :key="n"
      class="marker"
      ref="marker"
      :class="{ selected: isMarkerActive(n) }"
    >
      {{ n }}
    </button>
  </div>
</template>

<style scoped>
.marker-container {
  width: 100%;
  height: 100%;
  padding: 0.25em;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  position: absolute;
  opacity: 1;
  transition: opacity 250ms ease-out;
  z-index: 5;
}

.marker {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.45em;
  font-weight: 400;
  color: var(--whisper);
  cursor: pointer;
  opacity: 0.5;
  font-weight: 600;
  visibility: hidden;
  border: none;
  background: none;
  border-radius: 50%;
  transform: translate3d(0, 0, 0);
  transition:
    color 250ms ease-in-out,
    opacity 250ms ease-in-out,
    background-color 250ms ease-in-out,
    transform 250ms ease-out;
}

.marker:not(.selected):nth-child(1) {
  transform: translate3d(100%, 100%, 0);
}

.marker:not(.selected):nth-child(2) {
  transform: translate3d(0, 100%, 0);
}

.marker:not(.selected):nth-child(3) {
  transform: translate3d(-100%, 100%, 0);
}

.marker:not(.selected):nth-child(4) {
  transform: translate3d(100%, 0, 0);
}

.marker:not(.selected):nth-child(5) {
  transform: translate3d(0, 0, 0);
}

.marker:not(.selected):nth-child(6) {
  transform: translate3d(-100%, 0, 0);
}

.marker:not(.selected):nth-child(7) {
  transform: translate3d(100%, -100%, 0);
}

.marker:not(.selected):nth-child(8) {
  transform: translate3d(0, -100%, 0);
}

.marker:not(.selected):nth-child(9) {
  transform: translate3d(-100%, -100%, 0);
}

.marker.selected {
  opacity: 1;
  visibility: visible;
}

.marker-container:hover .marker {
  opacity: 0.6;
  transform: translate3d(0, 0, 0);
  visibility: visible;
}

.marker-container:hover .marker.selected {
  opacity: 1;
  background-color: var(--tickle-me-pink);
}

.marker-container:hover .marker:hover {
  opacity: 1;
}

@container (min-width: 1000px) {
  .marker {
    font-size: 0.675em;
  }
}
</style>
