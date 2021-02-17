import Cell from './Cell';

export default class Solver {
  originalMap: Array<Array<number>>;
  #solution: Array<Array<number>>;

  constructor(orginalMap: Array<Array<number>>) {
    this.#solution = orginalMap;
  }

  solve() {
    // for (let row = 0; row < 9; row++) {
    //   for(let col = 0; col < 9; col++ ) {
    //   let col = 0;
    //   let value = 1;
    //   while(value < 10) {
    //     const currentRow = solution[row];
    //     value++;
    //     col++;
    //   }
    //     for(let v = 1; v < 10; v++) {
    //       const line = solution[x];
    //       const col =
    //       solution[x][0]
    //       solution[x][1]
    //       solution[x][2]
    //       solution[x][3]
    //       solution[x][4]
    //       solution[x][5]
    //       solution[x][6]
    //       solution[x][7]
    //       solution[x][8]
    //       solution[x][y]
    //     }
    //   }
    // }
  }

  setSolution(value: Array<Array<number>>) {
    this.#solution = value;
  }

  getSolution() {
    return this.#solution;
  }

  isInArray(value: number, array: Array<number>) {}

  isInRow(value: number, row: number) {
    return this.isInArray(value, this.#solution[row]);
  }

  isInColumn(value: number, col: number) {
    const column = this.getSolution().map((value) => value[col]);
    return this.isInArray(value, column);
  }

  isInBlock(value: number, posX: number, posY: number) {
    const index = posX * 9 + posY;

    // [6,0][6, 1][6,2]
    // [7,0][7, 1][7,2]
    // [8,0][8, 1][8,2]

    // [Math.floor(index / 3), index % 3]
  }
}
