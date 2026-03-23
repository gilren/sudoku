import { BLOCK_SIZE, BOARD_SIZE } from '@/constants'
import type { Board } from '@/types'

const MINIMUM_CLUES = 17

export function solveBoard(initialBoard: Board): Board | null {
  if (!isValidBoard(initialBoard)) return null

  let solution: Board | null = null
  const board = initialBoard.map((row) => [...row]) as Board

  if (solveFromCell(board, 0, 0)) {
    // console.log('Sudoku was solved successfully')
    solution = board
  }

  return solution
}

function solveFromCell(board: Board, row: number, col: number): boolean {
  if (row < 0 || row > BOARD_SIZE) return false
  // If we reach the end of a column, move to the next row.
  if (col === BOARD_SIZE) {
    col = 0
    row++
  }

  // If we reach the end of the board, the puzzle is solved
  if (row === BOARD_SIZE) {
    return true
  }

  // If the cell is filled, move to the next
  if (board[row]![col] !== 0) {
    return solveFromCell(board, row, col + 1)
  }

  // Try each possible value for the empty cell
  for (let num = 1; num <= BOARD_SIZE; num++) {
    if (canPlaceValue(num, row, col, board)) {
      board[row]![col] = num
      if (solveFromCell(board, row, col + 1)) {
        return true
      }
    }
    // Backtrack: reset cell to 0 and try the next value
    board[row]![col] = 0
  }

  return false
}

function isValidBoard(board: unknown): board is Board {
  if (!Array.isArray(board)) return false
  if (board.length !== BOARD_SIZE) return false

  let clueCount = 0

  for (const row of board) {
    if (!Array.isArray(row) || row.length !== BOARD_SIZE) return false

    for (const cell of row) {
      if (!Number.isInteger(cell) || cell < 0 || cell > 9) {
        return false
      }

      if (cell !== 0) {
        clueCount++
        if (clueCount >= MINIMUM_CLUES) return true
      }
    }
  }

  return clueCount >= MINIMUM_CLUES
}

function canPlaceValue(value: number, row: number, col: number, board: Board): boolean {
  // Check 3x3 block
  const startX = BLOCK_SIZE * Math.floor(col / BLOCK_SIZE)
  const startY = BLOCK_SIZE * Math.floor(row / BLOCK_SIZE)

  for (let y = 0; y < BLOCK_SIZE; y++) {
    for (let x = 0; x < BLOCK_SIZE; x++) {
      if (board[startY + y]![startX + x] === value) return false
    }
  }

  // Check column (skip rows already covered by the block)
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r < startY || r > startY + (BLOCK_SIZE - 1)) {
      if (board[r]![col] === value) return false
    }
  }

  // Check row (skip columns already covered by the block)
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c < startX || c > startX + (BLOCK_SIZE - 1)) {
      if (board[row]![c] === value) return false
    }
  }

  return true
}
