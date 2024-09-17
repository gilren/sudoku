import { SudokuNumber } from './types';

export default class Solver {
  originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>;
  currentMap: Array<Array<SudokuNumber>>;
  solution: Array<Array<SudokuNumber>>;

  constructor(
    originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>,
    currentMap: Array<Array<SudokuNumber>>,
  ) {
    this.originalMap = originalMap;
    this.currentMap = currentMap;
    this.solution = originalMap.map((arr) => [...arr]);
  }

  solve() {
    let row = 0;
    let col = 0;
    const board = this.solution;
    const length = board.length;

    const solveFromCell = (
      row: number,
      col: number,
    ): Array<Array<SudokuNumber>> | boolean => {
      // If we reach the end of the column, move to the next row
      if (col === length) {
        col = 0;
        row++;
      }

      // The base case: the entire board is filled correctly
      if (row === length) {
        return board;
      }

      // If the current cell is already filled, move to the next cell
      if (board[row][col] !== 0) {
        return solveFromCell(row, col + 1);
      }

      for (let value = 1 as SudokuNumber; value <= board.length; value++) {
        if (this.canPlaceValue(value, row, col)) {
          board[row][col] = value;

          // Recursively try to solve the rest of the board
          const solve = solveFromCell(row, col + 1);
          if (solve !== false) return solve;
        }

        // Backtrack: reset the cell to 0 and try the next value
        board[row][col] = 0;
      }

      return false;
    };

    solveFromCell(row, col);
  }

  canPlaceValue(value: number, row: number, col: number): boolean {
    const board = this.solution;
    const length = board.length;

    // Can place in column & row
    for (let i = 0; i < length; i++) {
      if (board[i][col] === value || board[row][i] === value) {
        return false;
      }
    }

    // Can place in block
    const regionSize = Math.sqrt(board.length);

    const startX = regionSize * Math.floor(row / regionSize);
    const startY = regionSize * Math.floor(col / regionSize);

    for (let x = 0; x < regionSize; x++) {
      for (let y = 0; y < regionSize; y++) {
        if (board[startX + x][startY + y] === value) {
          return false;
        }
      }
    }

    return true;
  }
}
