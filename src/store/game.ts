import { defineStore } from 'pinia'
import { solveBoard } from '@/lib/solver'
import { BOARD_SIZE } from '@/constants'
import {
  type Board,
  type CellMarkers,
  type Difficulty,
  type Duplicate,
  type MarkersBoard,
  type Status,
  type UndoAction,
} from '@/types'
import { isDifficulty } from '@/lib/utils'

interface GameState {
  initialBoard: Board
  board: Board
  markers: MarkersBoard
  difficulty: Difficulty
  status: Status
  seed?: number
  solution: Board | null
  undoStack: UndoAction[]
  errors: Duplicate[]
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    initialBoard: createEmptyBoard(),
    board: createEmptyBoard(),
    markers: createEmptyMarkersArray(),
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

    getMarkersForCell: (state) => {
      return (x: number, y: number) => {
        return state.markers[x]![y]!
      }
    },
  },
  actions: {
    setDifficulty(difficulty: Difficulty) {
      if (!isDifficulty(difficulty)) difficulty = 'easy'

      this.deleteSeed()
      this.difficulty = difficulty
      localStorage.setItem('difficulty', difficulty)
    },

    setSolution(solution: Board | null) {
      this.solution = solution
    },

    async loadBoard() {
      try {
        this.status = 'loading'
        const difficulty = this.getDifficulty

        const data: Board[] = (await import(`../../sudokus/${difficulty}.json`)).default

        let seed = this.getOrCreateSeed(data.length)

        if (data[seed] === undefined) {
          seed = this.createSeed(data.length)
        }

        this.board = data[seed]!
        this.initialBoard = data[seed]!

        console.log(`Loading board with difficulty ${difficulty} and seed ${seed}`)
        this.status = 'playing'
      } catch (e) {
        this.status = 'failure'
        console.error('Failed to load board:', e)
        throw e
      }
    },

    getOrCreateSeed(maxLength: number): number {
      if (this.seed !== undefined) return this.seed

      const stored = localStorage.getItem('seed')
      if (stored === null) return this.createSeed(maxLength)

      const parsed = Number(stored)
      if (Number.isNaN(parsed)) return this.createSeed(maxLength)

      this.seed = parsed
      return this.seed
    },

    createSeed(maxLength: number): number {
      this.seed = Math.floor(Math.random() * maxLength)
      localStorage.setItem('seed', this.seed.toString())
      return this.seed
    },

    deleteSeed() {
      localStorage.removeItem('seed')
      this.seed = undefined
    },

    deleteBoards() {
      this.board = createEmptyBoard()
      this.initialBoard = createEmptyBoard()
      this.markers = createEmptyMarkersArray()
    },

    deleteSolution() {
      this.setSolution(null)
    },

    deleteUndoStack() {
      this.undoStack = []
    },

    updateCell(x: number, y: number, value: number, newMarkers: CellMarkers) {
      const previousValue = this.board[y]![x]!
      const previousMarkers = new Set(this.markers[y]![x])
      const newMarkersCopy = new Set(newMarkers)

      this.undoStack.push({
        x: x,
        y: y,
        previousValue,
        newValue: value,
        previousMarkers,
        newMarkers: newMarkersCopy,
      })

      this.board[y]![x] = value
      this.markers[y]![x] = newMarkersCopy

      if (!this.getFlattenedBoard.some((cell) => cell.value === 0)) {
        this.finish()
      }
    },

    finish() {
      if (this.validate(true)) {
        this.status = 'solved'
        this.deleteUndoStack()
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

      if (!filled) return false

      const errors: Duplicate[] = []

      for (let y = 0; y < BOARD_SIZE; y++) {
        for (let x = 0; x < BOARD_SIZE; x++) {
          const current = this.getBoard[y]![x]
          if (typeof current !== 'number') return false
          if (current === 0) continue
          if (current !== this.getSolution[y]![x]) {
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
      }

      console.log('Sudoku is valid')
      return true
    },

    undo() {
      if (this.undoStack.length === 0) {
        console.log('No action to undo')
        return
      }

      const { x, y, previousValue, previousMarkers } = this.undoStack.pop()!

      if (previousValue) {
        this.board[y]![x] = previousValue
      }

      if (previousMarkers) {
        this.markers[y]![x] = previousMarkers
      }
    },

    restartGame() {
      this.deleteUndoStack()
      this.deleteBoards()
      this.setDifficulty(this.getDifficulty)
      this.loadBoard()
    },

    newGame() {
      this.deleteSeed()
      this.deleteSolution()
      this.restartGame()
    },
  },
})

function initStoreDifficulty(): Difficulty {
  const storedDifficulty = localStorage.getItem('difficulty')
  if (isDifficulty(storedDifficulty)) return storedDifficulty
  const difficulty = 'easy'
  localStorage.setItem('difficulty', difficulty)

  return difficulty
}

function createEmptyBoard(): Board {
  return Array.from({ length: 9 }, () => Array(9).fill(0)) as Board
}

function createEmptyMarkersArray(): MarkersBoard {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => null)) as MarkersBoard
}
