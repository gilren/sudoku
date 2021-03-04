import Cell from './Cell';

export default class Solver {
  originalMap: Array<Array<number>>;
  #solution: Array<Array<number>>;
  isSolved: boolean = false;

  constructor(orginalMap: Array<Array<number>>) {
    this.#solution = orginalMap;
  }

  solve() {
    console.log(this.isAllowedInCell(4, 0, 0));
    let iteration = 0;
    while (!this.isSolved) {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (this.#solution[row][col] === 0) {
            let value = 1;

            let allowedValues = [];
            while (value < 10) {
              if (this.isAllowedInCell(value, row, col)) {
                // console.log(`${value} is allowed in cell [${row}, ${col}]`);
                allowedValues.push(value);
              }
              value++;
            }
            if (value > 9) {
              if (allowedValues.length === 1) {
                console.log(
                  `${allowedValues[0]} was inserted in cell [${row}, ${col}]`,
                );
                this.#solution[row][col] = allowedValues[0];
              }
            }
          }
        }
      }
      iteration++;
      if (iteration == 50) {
        this.isSolved = true;
      }
      // this.isSolved =
      //   [].concat(...this.#solution).filter((x) => x === 0).length < 1;
      console.log(this.#solution);

      // this.isSolved =
      //   ;
    }
  }

  setSolution(value: Array<Array<number>>) {
    this.#solution = value;
  }

  getSolution() {
    return this.#solution;
  }

  isDuplicateInArray(value: number, array: Array<number>) {
    return [...array].filter((x) => x === value).length < 1;
  }

  isAllowedInCell(value, posX, posY) {
    return (
      this.isAllowedInBlock(value, posX, posY) &&
      this.isAllowedInRow(value, posX) &&
      this.isAllowedInColumn(value, posY)
    );
  }

  isAllowedInRow(value: number, row: number) {
    return this.isDuplicateInArray(value, this.#solution[row]);
  }

  isAllowedInColumn(value: number, col: number) {
    const column = this.getSolution().map((value) => value[col]);
    return this.isDuplicateInArray(value, column);
  }

  isAllowedInBlock(value: number, posX: number, posY: number) {
    const index = posX * 9 + posY;

    // Find wich block the cell is a part of
    let currentBlockNb = Math.floor(posX / 3) + 1 + Math.floor(posY / 3) + 1;

    let startX = posX - (posX - 3 * Math.floor(posX / 3));
    let startY = Math.floor(posY / 3) * 3;

    let blockArray = [];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        blockArray.push(this.getSolution()[startX + x][startY + y]);
      }
    }

    return this.isDuplicateInArray(value, blockArray);
  }
}
