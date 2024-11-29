import { solveBoard } from '@/Solver'
import { BOARD_SIZE } from '@/utils/constants'
import { Difficulty, type Duplicate, type Status, type UndoAction } from '@/utils/types'
import { isDifficulty } from '@/utils/utils'
import { defineStore } from 'pinia'

interface GameState {
  initialBoard: number[][]
  board: number[][]
  markers: Set<number>[][]
  difficulty: Difficulty
  status: Status
  seed?: number
  solution: number[][] | null
  undoStack: UndoAction[]
  errors: Duplicate[]
}

function initStoreDifficulty(): Difficulty {
  const storedDifficulty = localStorage.getItem('difficulty')
  return isDifficulty(storedDifficulty) ? storedDifficulty : Difficulty.EASY
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    initialBoard: Array.from({ length: 9 }, () => Array(9).fill(0)),
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    markers: Array.from({ length: 9 }, () =>
      Array(9)
        .fill(null)
        .map(() => new Set<number>()),
    ),
    difficulty: initStoreDifficulty(),
    status: 'init',
    seed: undefined,
    solution: null,
    undoStack: [],
    errors: [],
  }),
  getters: {
    getDifficulty: (state) => {
      return state.difficulty
    },
    getInitialBoard: (state) => {
      return state.initialBoard
    },
    getBoard: (state) => {
      return state.board
    },
    getFlattenedBoard: (state) => {
      return state.board.flatMap((row, rowIdx) =>
        row.map((value, colIdx) => ({
          value,
          index: rowIdx * BOARD_SIZE + colIdx,
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
        this.deleteSeed()
        this.difficulty = difficulty
        localStorage.setItem('difficulty', difficulty)
      } else {
        throw new Error('Trying to assign non valid difficulty')
      }
    },

    setSolution(solution: number[][] | null) {
      this.solution = solution
    },

    async loadBoard() {
      try {
        this.status = 'loading'
        const difficulty = this.getDifficulty
        this.deleteBoards()

        const data: number[][][] = (await import(`../../sudokus/${difficulty}.json`)).default

        const seed = this.getOrGenerateSeed(data)

        this.board = JSON.parse(JSON.stringify(data[seed]))
        this.initialBoard = JSON.parse(JSON.stringify(data[seed]))
        console.log(`Loading board with difficulty ${difficulty} and seed ${seed}`)
        this.status = 'playing'
      } catch (e) {
        this.status = 'failure'
        console.error('Failed to load board:', e)
        throw e
      }
    },

    getOrGenerateSeed(data: number[][][]): number {
      const storageSeed = Number(localStorage.getItem('seed'))

      if (isNaN(storageSeed) && typeof this.seed === 'undefined') {
        this.seed = Math.floor(Math.random() * data.length)
        localStorage.setItem('seed', this.seed.toString())
      } else {
        this.seed = storageSeed
      }

      return this.seed
    },

    deleteSeed() {
      localStorage.removeItem('seed')
      this.seed = undefined
    },

    deleteBoards() {
      this.board = Array.from({ length: 9 }, () => Array(9).fill(0))
      this.initialBoard = Array.from({ length: 9 }, () => Array(9).fill(0))
    },

    deleteSolution() {
      this.setSolution(null)
    },

    deleteMarkers() {
      this.markers = Array.from({ length: 9 }, () =>
        Array(9)
          .fill(null)
          .map(() => new Set<number>()),
      )
    },

    updateCell(x: number, y: number, value: number, newMarkers: Set<number>) {
      const previousValue = this.board[y][x]
      const previousMarkers = new Set(this.markers[y][x])
      const newMarkersCopy = new Set(newMarkers)

      this.undoStack.push({
        x: x,
        y: y,
        previousValue,
        newValue: value,
        previousMarkers,
        newMarkers: newMarkersCopy,
      })

      this.board[y][x] = value
      this.markers[y][x] = newMarkersCopy

      if (!this.getFlattenedBoard.some((cell) => cell.value === 0)) {
        this.finish()
      }
    },

    finish() {
      if (this.validate(true)) {
        this.status = 'solved'
        alert('Congrats, the sudoku is solved')
      }
    },

    validate(filled: boolean = false): boolean {
      if (!this.getSolution) {
        this.setSolution(solveBoard(this.getInitialBoard))
      }

      if (!this.getBoard || !this.getSolution) {
        console.error('Active board or solution is null')
        return false
      }

      if (filled) {
        const errors: Duplicate[] = []

        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            const current = this.getBoard[y][x]
            if (current === 0) continue
            if (current !== this.getSolution[y][x]) {
              const error: Duplicate = {
                value: current,
                id: x * BOARD_SIZE + y,
              }
              errors.push(error)
              // console.log(`Error found at ${x}, ${y}, value: ${current}`)
            }
          }
        }

        if (errors.length > 0) {
          console.log('Sudoku has errors')
          return false
        } else {
          console.log('Sudoku is valid')
          return true
        }
      } else {
        return false
      }
    },

    undo() {
      if (this.undoStack.length > 0) {
        const action = this.undoStack.pop()!
        const { x, y, previousValue, previousMarkers } = action

        if (previousValue !== undefined) {
          this.board[y][x] = previousValue
        }

        if (previousMarkers !== undefined) {
          this.markers[y][x] = previousMarkers
        }
      } else {
        console.log('No action to undo')
      }
    },

    restartGame() {
      this.deleteMarkers()
      this.loadBoard()
    },

    newGame() {
      this.deleteSeed()
      this.deleteSolution()
      this.deleteMarkers()
      this.loadBoard()
    },
  },
})
