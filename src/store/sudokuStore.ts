import { reactive } from 'vue'

interface SudokuState {
  board: number[][]
}

export const state = reactive<SudokuState>({
  board: [[]],
})
