import { CanPlaceResult, SudokuNumber } from './types';

export default class Solver {
  originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>;
  currentMap: Array<Array<SudokuNumber>>;
  solution: Array<Array<SudokuNumber>> | null;
  length: number;
  regionSize: number;

  constructor(
    originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>,
    currentMap: Array<Array<SudokuNumber>>,
  ) {
    this.originalMap = originalMap;
    this.currentMap = currentMap;
    this.solution = null;
    this.length = originalMap.length;
    this.regionSize = Math.sqrt(this.length);
  }

  solve(): Array<Array<SudokuNumber>> | null {
    const board = this.originalMap.map((arr) => [...arr]);

    if (!this.validateBoard(board)) {
      console.error('Invalid Sudoku board configuration.');
      return null;
    }

    if (this.solution !== null) return this.solution;

    const solveFromCell = (
      row: number,
      col: number,
    ): Array<Array<SudokuNumber>> | null => {
      // If we reach the end of the column, move to the next row
      if (col === this.length) {
        col = 0;
        row++;
      }

      // The base case: the entire board is filled correctly
      if (row === this.length) {
        return board;
      }

      // If the current cell is already filled, move to the next cell
      if (board[row][col] !== 0) {
        return solveFromCell(row, col + 1);
      }

      for (let value = 1 as SudokuNumber; value <= board.length; value++) {
        const canPlaceValue = this.canPlaceValue(value, row, col, board);
        console.log(canPlaceValue);
        if (canPlaceValue.result === 'valid') {
          board[row][col] = value;

          // Recursively try to solve the rest of the board
          const solve = solveFromCell(row, col + 1);
          if (solve !== null) return solve;
        }

        // Backtrack: reset the cell to 0 and try the next value
        board[row][col] = 0;
      }

      return null;
    };

    const solution = solveFromCell(0, 0);

    if (solution !== null) {
      this.solution = solution;
      return this.solution;
    }
  }

  canPlaceValue(
    value: number,
    row: number,
    col: number,
    board: Array<Array<SudokuNumber>>,
  ): CanPlaceResult {
    // Can place in block
    const startX = this.regionSize * Math.floor(row / this.regionSize);
    const startY = this.regionSize * Math.floor(col / this.regionSize);

    for (let x = 0; x < this.regionSize; x++) {
      for (let y = 0; y < this.regionSize; y++) {
        // console.log(`Checking block: {${x},${y}} - Value: ${value}`);
        if (board[startX + x][startY + y] === value) {
          // console.log(`Duplicate found in block at {${startX + x}, ${startY + y}}`);
          return {
            result: 'duplicate',
            row: startX + x,
            col: startY + y,
          };
        }
      }
    }

    // Can place in row & column
    for (let i = 0; i < this.length; i++) {
      // Skip cells that overlap with the block in the column
      if (i < startX || i > startX + 2) {
        // console.log(`Checking column: {${i},${col}} - Value: ${value}`);
        if (board[i][col] === value) {
          // console.log(`Duplicate found in column at {${i}, ${col}}`);
          return {
            result: 'duplicate',
            row: i,
            col: col,
          };
        }
      }

      // Skip cells that overlap with the block in the row
      if (i < startY || i > startY + 2) {
        // console.log(`Checking row: {${row}, ${i}} - Value: ${value}`);
        if (board[row][i] === value) {
          // console.log(`Duplicate found in row at {${row}, ${i}}`);
          return {
            result: 'duplicate',
            row: row,
            col: i,
          };
        }
      }
    }

    return {
      result: 'valid',
    };
  }

  validateBoard(board: Array<Array<SudokuNumber>>): boolean {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const value = board[row][col];

        // Ignore empty cells (0)
        if (value !== 0) {
          // Temporarily set the current cell to 0 to avoid self-check
          board[row][col] = 0;

          // Check if the value can be placed in this cell's row, column, and block
          if (!this.canPlaceValue(value, row, col, board)) {
            // Restore the value and return false (invalid board)
            board[row][col] = value;
            return false;
          }

          // Restore the value after the check
          board[row][col] = value;
        }
      }
    }
    return true;
  }
}
