<script setup lang="ts">
import SudokuCell from '@/components/SudokuCell.vue'
import { computed, onMounted, onUnmounted, ref, type ComponentPublicInstance, type Ref } from 'vue'
import { useGameStore } from '@/store/game'
import { isAllowedKey } from '@/utils/utils'

const store = useGameStore()

const cellRefs: Ref<ComponentPublicInstance<typeof SudokuCell>[]> = ref([])
const activeCell = ref<ComponentPublicInstance<typeof SudokuCell> | null>(null)

onMounted(() => {
  window.addEventListener('keydown', handleKeypress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeypress)
})

function handleKeypress(e: KeyboardEvent) {
  let key = e.key
  if ((e.ctrlKey || e.metaKey) && key === 'z') {
    e?.preventDefault()
    store.undo()
  }

  if (activeCell.value) {
    if (key === 'Backspace' || key === 'Delete') {
      key = '0'
    }
    if (isAllowedKey(key)) {
      activeCell.value.sendKey(key)
    }
  }
}

function handleMouseEnter(index: number) {
  activeCell.value = cellRefs.value[index]
}

function handleMouseLeave() {
  activeCell.value = null
}

const flattenedBoard = computed(() => store.getFlattenedBoard)
</script>

<template>
  <div v-if="store.loading" class="loading">Loading...</div>
  <div v-else class="sudoku__grid" @mouseleave="handleMouseLeave()">
    <SudokuCell
      v-for="(cell, idx) in flattenedBoard"
      :key="cell.index"
      :value="cell.value"
      :index="cell.index"
      :coords="cell.coords"
      :ref="(el) => (cellRefs[idx] = el as ComponentPublicInstance<typeof SudokuCell>)"
      @mouseenter="handleMouseEnter(idx)"
    />
  </div>
</template>

<style scoped>
pre {
  position: absolute;
  background: black;
  width: 30%;
  padding: 1rem;
  right: 0;
  z-index: 2;
  top: 0;
}
.sudoku__grid {
  width: 100%;
  height: 100%;
  border: 2px solid var(--blue-violet);
  user-select: none;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(9, 1fr);
  border-radius: 15px;
  overflow: hidden;
  flex-shrink: 0;
}

.sudoku__grid .cell:nth-child(9n + 3),
.sudoku__grid .cell:nth-child(9n + 6) {
  border-right-color: var(--blue-violet);
}

.sudoku__grid .cell:nth-child(19),
.sudoku__grid .cell:nth-child(20),
.sudoku__grid .cell:nth-child(21),
.sudoku__grid .cell:nth-child(22),
.sudoku__grid .cell:nth-child(23),
.sudoku__grid .cell:nth-child(24),
.sudoku__grid .cell:nth-child(25),
.sudoku__grid .cell:nth-child(26),
.sudoku__grid .cell:nth-child(27),
.sudoku__grid .cell:nth-child(46),
.sudoku__grid .cell:nth-child(47),
.sudoku__grid .cell:nth-child(48),
.sudoku__grid .cell:nth-child(49),
.sudoku__grid .cell:nth-child(50),
.sudoku__grid .cell:nth-child(51),
.sudoku__grid .cell:nth-child(52),
.sudoku__grid .cell:nth-child(53),
.sudoku__grid .cell:nth-child(54) {
  border-bottom-color: var(--blue-violet);
}
</style>
