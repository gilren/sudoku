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
  // Can place in block
  const startX = BLOCK_SIZE * Math.floor(row / BLOCK_SIZE)
  const startY = BLOCK_SIZE * Math.floor(col / BLOCK_SIZE)

  for (let x = 0; x < BLOCK_SIZE; x++) {
    for (let y = 0; y < BLOCK_SIZE; y++) {
      // console.log(`Checking block: {${x},${y}} - Value: ${value}`);
      if (board[startX + x]![startY + y] === value) {
        // console.log(`Duplicate found in block at {${startX + x}, ${startY + y}}`);
        return false
      }
    }
  }

  // Can place in row & column
  for (let i = 0; i < BOARD_SIZE; i++) {
    // Skip cells that overlap with the block in the column
    if (i < startX || i > startX + (BLOCK_SIZE - 1)) {
      // console.log(`Checking column: {${i},${col}} - Value: ${value}`);
      if (board[i]![col] === value) {
        // console.log(`Duplicate found in column at {${i}, ${col}}`);
        return false
      }
    }

    // Skip cells that overlap with the block in the row
    if (i < startY || i > startY + (BLOCK_SIZE - 1)) {
      // console.log(`Checking row: {${row}, ${i}} - Value: ${value}`);
      if (board[row]![i] === value) {
        // console.log(`Duplicate found in row at {${row}, ${i}}`);
        return false
      }
    }
  }

  return true
}
