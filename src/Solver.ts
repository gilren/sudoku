import Cell from './Cell';
import { potentialValuesMap, allowedValue } from './types';

export default class Solver {
  originalMap: Array<Array<number>>;
  #solution: Array<Array<number>>;
  isSolved: boolean = false;

  constructor(orginalMap: Array<Array<number>>) {
    this.#solution = orginalMap;
  }

  solve() {
    this.checkLine(0);
    this.checkLine(1);
    this.checkLine(2);
    this.checkLine(3);
    this.checkLine(4);
    this.checkLine(5);
    this.checkLine(6);
    this.checkLine(7);
    this.checkLine(8);
    this.checkColumn(0);
    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);

    // this.checkLine(1);
    // console.log(this.isAllowedInCell(4, 0, 0));
    // let iteration = 0;
    // while (!this.isSolved) {
    //   for (let row = 0; row < 9; row++) {
    //     for (let col = 0; col < 9; col++) {
    //       if (this.#solution[row][col] === 0) {
    //         let value = 1;
    //         let allowedValues = [];
    //         while (value < 10) {
    //           if (this.isAllowedInCell(value, row, col)) {
    //             // console.log(`${value} is allowed in cell [${row}, ${col}]`);
    //             allowedValues.push(value);
    //           }
    //           value++;
    //         }
    //         if (value > 9) {
    //           if (allowedValues.length === 1) {
    //             console.log(
    //               `${allowedValues[0]} was inserted in cell [${row}, ${col}]`,
    //               `in iteration ${iteration}`,
    //             );
    //             this.#solution[row][col] = allowedValues[0];
    //           }
    //         }
    //       }
    //     }
    //   }
    //   iteration++;
    //   if (iteration == 15) {
    //     this.isSolved = true;
    //   }
    //   // this.isSolved =
    //   //   [].concat(...this.#solution).filter((x) => x === 0).length < 1;
    //   // this.isSolved =
    //   //   ;
    // }
  }

  setSolution(value: Array<Array<number>>) {
    this.#solution = value;
  }

  getSolution() {
    return this.#solution;
  }

  getMissingValuesFromArray(array: Array<number>) {
    let missingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let newArray = [...array].filter((x) => x !== 0);
    return missingValues.filter((y) => !newArray.includes(y));
  }

  isArrayComplete(array: Array<number>) {
    return [...array].filter((x) => x === 0).length < 1;
  }

  isArrayMissingOne(array: Array<number>) {
    return [...array].filter((x) => x === 0).length === 1;
  }

  isDuplicateInArray(value: number, array: Array<number>) {
    return [...array].filter((x) => x === value).length < 1;
  }

  isCellEmpty(posX: number, posY: number) {
    return this.#solution[posX][posY] === 0;
  }

  isAllowedInCell(value: number, posX: number, posY: number) {
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
    const column = [...this.getSolution()].map((value) => value[col]);
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

  checkLine(rowNb: number) {
    const row = this.#solution[rowNb];
    if (this.isArrayComplete(row)) return;

    const missingValues = this.getMissingValuesFromArray(row);

    console.log(missingValues);

    let missingValuesPossibilites: potentialValuesMap = {};

    const currentPosX = rowNb;
    let valueIndex = 0;

    while (valueIndex < missingValues.length) {
      let value = missingValues[valueIndex];
      let currentPosY = 0;

      let allowedValues: Array<allowedValue> = [];

      while (currentPosY < 9) {
        if (this.isAllowedInBlock(value, currentPosX, currentPosY)) {
          if (this.isCellEmpty(currentPosX, currentPosY)) {
            if (this.isAllowedInColumn(value, currentPosY)) {
              // console.log(value, currentPosX, currentPosY);
              if (missingValuesPossibilites[value]) {
                missingValuesPossibilites[value] = [
                  ...missingValuesPossibilites[value],
                  [currentPosX, currentPosY],
                ];
              } else {
                missingValuesPossibilites[value] = [[currentPosX, currentPosY]];
              }

              allowedValues.push({ column: currentPosY, value: value });
            }
          }
          currentPosY++;
        } else {
          currentPosY = currentPosY + 3;
        }
      }

      if (currentPosY > 9) {
        if (allowedValues.length === 1) {
          this.insertValueInCell(
            allowedValues[0].value,
            rowNb,
            allowedValues[0].column,
          );
        }
      }

      valueIndex++;
    }

    console.log(missingValuesPossibilites);

    Object.keys(missingValuesPossibilites).map((key) => {
      if (missingValuesPossibilites[key].length === 1) {
        const [posX, posY] = missingValuesPossibilites[key][0];
        console.log(`Inserted by missingValuesPossibilites row ${rowNb}`);
        this.insertValueInCell(Number(key), posX, posY);
      }
    });

    if (this.isArrayMissingOne(row)) {
      console.log(`Inserted by isArrayMissingOne row ${rowNb}`);
      this.insertValueInCell(
        this.findLastValueFromArray(row),
        rowNb,
        row.indexOf(0),
      );
    }
  }
  checkColumn(columnNb: number) {
    const column = [...this.getSolution()].map((value) => value[columnNb]);
    if (this.isArrayComplete(column)) return;

    const missingValues = this.getMissingValuesFromArray(column);

    let missingValuesPossibilites: potentialValuesMap = {};

    const currentPosY = columnNb;
    let valueIndex = 0;

    while (valueIndex < missingValues.length) {
      let value = missingValues[valueIndex];
      let currentPosX = 0;

      let allowedValues: Array<allowedValue> = [];
      while (currentPosX < 9) {
        if (this.isAllowedInBlock(value, currentPosX, currentPosY)) {
          if (this.isCellEmpty(currentPosX, currentPosY)) {
            if (this.isAllowedInRow(value, currentPosX)) {
              if (missingValuesPossibilites[value]) {
                missingValuesPossibilites[value] = [
                  ...missingValuesPossibilites[value],
                  [currentPosX, currentPosY],
                ];
              } else {
                missingValuesPossibilites[value] = [[currentPosX, currentPosY]];
              }
              allowedValues.push({ row: currentPosX, value: value });
            }
          }
          currentPosX++;
        } else {
          currentPosX = currentPosX + 3;
        }
      }

      if (currentPosX > 9) {
        if (allowedValues.length === 1) {
          this.insertValueInCell(
            allowedValues[0].value,
            allowedValues[0].row,
            columnNb,
          );
        }
      }
      valueIndex++;
    }

    Object.keys(missingValuesPossibilites).map((key) => {
      if (missingValuesPossibilites[key].length === 1) {
        const [posX, posY] = missingValuesPossibilites[key][0];
        console.log(`Inserted by missingValuesPossibilites coumn ${columnNb}`);
        this.insertValueInCell(Number(key), posX, posY);
      }
    });

    if (this.isArrayMissingOne(column)) {
      console.log(`Inserted by isArrayMissingOne column ${columnNb}`);
      this.insertValueInCell(
        this.findLastValueFromArray(column),
        column.indexOf(0),
        columnNb,
      );
    }
  }

  checkblock(blockNb: number) {}

  findLastValueFromArray(array: Array<number>) {
    return 45 - array.reduce((a, b) => a + b);
  }

  insertValueInCell(value: number, posX: number, posY: number) {
    if (this.#solution[posX][posY] === 0) {
      console.log(`${value} was INSERTED in cell [${posX}, ${posY}]`);
      this.#solution[posX][posY] = value;
    }
  }
}
