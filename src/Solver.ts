const BOARD_SIZE = 9
const BLOCK_SIZE = Math.sqrt(BOARD_SIZE)
const MINIMUM_CLUES = 17

export function solveBoard(initialBoard: number[][]): number[][] | null {
  if (!isSudokuValid(initialBoard)) {
    console.error('Sudoku is not valid.')
    return null
  }
  let solution: number[][] | null = null
  const board = initialBoard.map((arr) => [...arr])

  if (solveFromCell(board, 0, 0)) {
    console.log('Sudoku was solved successfully')
    solution = board
  }

  return solution
}

function solveFromCell(board: number[][], row: number, col: number): boolean {
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
  if (board[row][col] !== 0) {
    return solveFromCell(board, row, col + 1)
  }

  // Try each possible value for the empty cell
  for (let num = 1; num <= BOARD_SIZE; num++) {
    if (canPlaceValue(num, row, col, board)) {
      board[row][col] = num
      if (solveFromCell(board, row, col + 1)) {
        return true
      }
    }
    // Backtrack: reset cell to 0 and try the next value
    board[row][col] = 0
  }

  return false
}

function isSudokuValid(board: number[][]): boolean {
  if (!board) return false

  let clues = 0

  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) clues++
      if (clues >= MINIMUM_CLUES) return true
    }
  }

  return false
}

function canPlaceValue(value: number, row: number, col: number, board: number[][]): boolean {
  // Can place in block
  const startX = BLOCK_SIZE * Math.floor(row / BLOCK_SIZE)
  const startY = BLOCK_SIZE * Math.floor(col / BLOCK_SIZE)

  for (let x = 0; x < BLOCK_SIZE; x++) {
    for (let y = 0; y < BLOCK_SIZE; y++) {
      // console.log(`Checking block: {${x},${y}} - Value: ${value}`);
      if (board[startX + x][startY + y] === value) {
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
      if (board[i][col] === value) {
        // console.log(`Duplicate found in column at {${i}, ${col}}`);
        return false
      }
    }

    // Skip cells that overlap with the block in the row
    if (i < startY || i > startY + (BLOCK_SIZE - 1)) {
      // console.log(`Checking row: {${row}, ${i}} - Value: ${value}`);
      if (board[row][i] === value) {
        // console.log(`Duplicate found in row at {${row}, ${i}}`);
        return false
      }
    }
  }

  return true
}
