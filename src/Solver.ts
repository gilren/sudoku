export default class Solver {
  originalMap: Array<Array<number>>;
  currentMap: Array<Array<number>>;
  solution: Array<Array<number>>;

  constructor(
    originalMap: Array<Array<number>>,
    currentMap: Array<Array<number>>,
  ) {
    this.solution = originalMap.map((arr) => arr.slice());
  }

  getSolution() {
    return this.solution;
  }

  isDuplicateInArray(value: number, array: Array<number>) {
    return [...array].filter((x) => x === value).length < 1;
  }

  isValuePresentdInRow(value: number, row: number) {
    return this.isDuplicateInArray(value, this.getSolution()[row]);
  }

  isValuePresentdInColumn(value: number, col: number) {
    return this.isDuplicateInArray(
      value,
      this.getSolution().map((value) => value[col]),
    );
  }

  isValuePresentdInBlock(value: number, posX: number, posY: number): Boolean {
    let regionSize = 3;

    const startX = regionSize * Math.floor(posX / regionSize);
    const startY = regionSize * Math.floor(posY / regionSize);

    let block = [] as Array<number>;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        block.push(this.getSolution()[startX + x][startY + y]);
      }
    }

    return this.isDuplicateInArray(value, block);
  }

  solve() {
    // console.table(this.solution);
    this.canSolveSudokuFromCell(0, 0, this.getSolution());
  }

  canSolveSudokuFromCell(
    row: number,
    col: number,
    board: Array<Array<number>>,
  ) {
    if (col === board[row].length) {
      col = 0;
      row++;
    }

    if (row === board.length) {
      return true;
    }

    if (board[row][col] != 0) {
      return this.canSolveSudokuFromCell(row, col + 1, board);
    }

    for (let value = 1; value <= board.length; value++) {
      let valueToPlace = value;

      if (this.canPlaceValue(valueToPlace, row, col)) {
        board[row][col] = valueToPlace;
        if (this.canSolveSudokuFromCell(row, col + 1, board)) {
          return true;
        }
      }
      board[row][col] = 0;
    }
  }

  canPlaceValue(valueToPlace: number, row: number, col: number) {
    if (!this.isValuePresentdInColumn(valueToPlace, col)) {
      return false;
    }

    if (!this.isValuePresentdInRow(valueToPlace, row)) {
      return false;
    }

    if (!this.isValuePresentdInBlock(valueToPlace, row, col)) {
      return false;
    }

    return true;
  }
}
