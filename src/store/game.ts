import { Difficulty } from '@/utils/types'
import { isDifficulty } from '@/utils/utils'
import { defineStore } from 'pinia'

interface GameState {
  board: number[][]
  difficulty: Difficulty
  loading: boolean
}

function initStoreDifficulty(): Difficulty {
  const storedDifficulty = localStorage.getItem('difficulty')
  return isDifficulty(storedDifficulty) ? storedDifficulty : Difficulty.EASY
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    difficulty: initStoreDifficulty(),
    loading: false,
  }),
  getters: {
    getDifficulty: (state) => {
      return state.difficulty
    },
    getBoard: (state) => {
      return state.board
    },
    getFlattenedBoard: (state) => {
      return state.board.flatMap((row, rowIdx) =>
        row.map((value, colIdx) => ({
          value,
          index: rowIdx * state.board[0].length + colIdx,
          coords: { x: colIdx, y: rowIdx },
        })),
      )
    },
  },
  actions: {
    setDifficulty(difficulty: Difficulty) {
      if (isDifficulty(difficulty)) {
        this.difficulty = difficulty
        localStorage.setItem('difficulty', difficulty)
      } else {
        throw new Error('Trying to assign non valid difficulty')
      }
    },
    async loadBoard() {
      try {
        this.loading = true
        console.log('loading board')
        const difficulty = this.getDifficulty
        const data = (await import(`../../sudokus/${difficulty}.json`)).default[0]
        this.board = data
        this.loading = false
      } catch (e) {
        console.error('Failed to load board:', e)
        throw e
      }
    },
  },
})

// export function useGameStore() {

//   async function loadBoard() {
//     try {
//       state.loading = true
//       console.log('loading board')
//       const difficulty = getDifficulty.value
//       const data = (await import(`../../sudokus/${difficulty}.json`)).default[0]
//       state.board.splice(0, state.board.length, ...data)
//       state.loading = false
//     } catch (e) {
//       console.error('Failed to load board:', e)
//       throw e
//     }
//   }

// }
