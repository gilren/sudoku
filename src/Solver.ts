import { BLOCK_SIZE, BOARD_SIZE } from './constants';
import { Board } from './types';

export default class Solver {
  board: Array<Array<number>>;
  solution: Board;

  constructor(board: Array<Array<number>>) {
    this.board = board;
    this.solution = null;
  }

  solve() {
    let board = this.board.map((arr) => [...arr]);

    // To edit when add cache
    if (this.solution !== null) {
      console.error('Sudoku was already solved.');
      return;
    }

    const solveFromCell = (row: number, col: number): boolean => {
      // If we reach the end of the column, move to the next row
      if (col === BOARD_SIZE) {
        col = 0;
        row++;
      }

      // Solved
      // The base case: the entire board is filled correctly
      if (row === BOARD_SIZE) {
        return true;
      }

      // If the current cell is already filled, move to the next cell
      if (board[row][col] !== 0) {
        return solveFromCell(row, col + 1);
      }

      // Try every possible value for specific cell
      for (let num = 1; num <= BOARD_SIZE; num++) {
        const canPlaceValue = this.canPlaceValue(num, row, col, board);
        if (canPlaceValue) {
          board[row][col] = num;
          if (solveFromCell(row, col + 1)) {
            return true;
          }
        }

        // Backtrack: reset the cell to 0 and try the next value
        board[row][col] = 0;
      }

      return false;
    };

    if (solveFromCell(0, 0)) {
      console.log('Sudoku was solved successfully');
      this.solution = board; // Check has been made in solveFromCell
    }
  }

  canPlaceValue(
    value: number,
    row: number,
    col: number,
    board: Array<Array<number>>,
  ): boolean {
    // Can place in block
    const startX = BLOCK_SIZE * Math.floor(row / BLOCK_SIZE);
    const startY = BLOCK_SIZE * Math.floor(col / BLOCK_SIZE);

    for (let x = 0; x < BLOCK_SIZE; x++) {
      for (let y = 0; y < BLOCK_SIZE; y++) {
        // console.log(`Checking block: {${x},${y}} - Value: ${value}`);
        if (board[startX + x][startY + y] === value) {
          // console.log(`Duplicate found in block at {${startX + x}, ${startY + y}}`);
          return false;
        }
      }
    }

    // Can place in row & column
    for (let i = 0; i < BOARD_SIZE; i++) {
      // Skip cells that overlap with the block in the column
      if (i < startX || i > startX + (BOARD_SIZE - 1)) {
        // console.log(`Checking column: {${i},${col}} - Value: ${value}`);
        if (board[i][col] === value) {
          // console.log(`Duplicate found in column at {${i}, ${col}}`);
          return false;
        }
      }

      // Skip cells that overlap with the block in the row
      if (i < startY || i > startY + (BOARD_SIZE - 1)) {
        // console.log(`Checking row: {${row}, ${i}} - Value: ${value}`);
        if (board[row][i] === value) {
          // console.log(`Duplicate found in row at {${row}, ${i}}`);
          return false;
        }
      }
    }

    return true;
  }
}
