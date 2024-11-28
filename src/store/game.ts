import { solveBoard } from '@/Solver'
import { Difficulty } from '@/utils/types'
import { isDifficulty } from '@/utils/utils'
import { defineStore } from 'pinia'

interface GameState {
  board: number[][]
  difficulty: Difficulty
  loading: boolean
  seed?: number
  solution?: number[][]
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
    seed: undefined,
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

    getSolution: (state) => {
      return state.solution
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

    setSolution(solution: number[][] | undefined) {
      this.solution = solution
    },

    async loadBoard() {
      try {
        this.loading = true
        const difficulty = this.getDifficulty
        this.deleteBoard()

        const data: number[][][] = (await import(`../../sudokus/${difficulty}.json`)).default

        const seed = this.getASeed(data)

        this.board = data[seed]
        console.log(`Loading board with difficulty ${difficulty} and seed ${seed}`)
        this.loading = false
      } catch (e) {
        console.error('Failed to load board:', e)
        throw e
      }
    },

    getASeed(data: number[][][]): number {
      const storageSeed = Number(localStorage.getItem('seed'))

      if (isNaN(storageSeed) && typeof this.seed === 'undefined') {
        this.seed = Math.floor(Math.random() * data.length)
        localStorage.setItem('seed', this.seed.toString())
      }
      return this.seed as number
    },

    deleteSeed() {
      localStorage.removeItem('seed')
      this.seed = undefined
    },

    deleteBoard() {
      this.board = Array.from({ length: 9 }, () => Array(9).fill(0))
    },

    deleteSolution() {
      this.setSolution(undefined)
    },

    updateCell(x: number, y: number, value: number) {
      console.log('updated cell', x, y)
      this.board = this.board.map((row, rowIdx) =>
        row.map((cell, colIdx) => (rowIdx === y && colIdx === x ? value : cell)),
      )
    },

    validate() {
      if (!this.getSolution) {
        this.setSolution(solveBoard(this.getBoard))
      }
    },
  },
})
