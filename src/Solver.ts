import { potentialValuesMap, allowedValue } from './types';

export default class Solver {
  originalMap: Array<Array<number>>;
  #solution: Array<Array<number>>;
  possibilites: Array<Array<Array<number>>>;
  isSolved: boolean = false;

  constructor(orginalMap: Array<Array<number>>) {
    this.#solution = orginalMap;
    this.possibilites = [];
  }

  initPossibilites() {
    let tempPossibilites = [];

    for (let x = 0; x < 9; x++) {
      let tempRow = [];
      const row = this.#solution[x];
      let values = this.getMissingValuesFromArray(row);
      for (let y = 0; y < 9; y++) {
        if (this.#solution[x][y] !== 0) {
          tempRow.push([]);
        } else {
          tempRow.push(values);
        }
      }
      tempPossibilites.push(tempRow);
    }
       
    for (let y = 0; y < 9; y++) {
      const column = [...this.#solution].map((value) => value[y]);
      for (let x = 0; x < 9; x++) {
        tempPossibilites[x][y] = tempPossibilites[x][y].filter(
          (val) => !column.includes(val),
        );
      }
    }

    

    this.possibilites = tempPossibilites;
  }

  solve() {
    this.initPossibilites();
    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);
    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);
    this.checkBlock(0);
    this.checkBlock(1);
    this.checkBlock(2);
    this.checkBlock(3);
    this.checkBlock(4);
    this.checkBlock(5);
    this.checkBlock(6);
    this.checkBlock(7);
    this.checkBlock(8);
    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);
    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);
    this.checkBlock(0);
    this.checkBlock(1);
    this.checkBlock(2);
    this.checkBlock(3);
    this.checkBlock(4);
    this.checkBlock(5);
    this.checkBlock(6);
    this.checkBlock(7);
    this.checkBlock(8);
    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);

    // let id = 0;
    for (let x = 0, id = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        this.checkCell(id);
        id++;
      }
    }

    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);

    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);

    this.checkBlock(0);
    this.checkBlock(1);
    this.checkBlock(2);
    this.checkBlock(3);
    this.checkBlock(4);
    this.checkBlock(5);
    this.checkBlock(6);
    this.checkBlock(7);
    this.checkBlock(8);

    for (let x = 0, id = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        this.checkCell(id);
        id++;
      }
    }
    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);

    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);

    this.checkBlock(0);
    this.checkBlock(1);
    this.checkBlock(2);
    this.checkBlock(3);
    this.checkBlock(4);
    this.checkBlock(5);
    this.checkBlock(6);
    this.checkBlock(7);
    this.checkBlock(8);

    for (let x = 0, id = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        this.checkCell(id);
        id++;
      }
    }
    this.checkRow(0);
    this.checkRow(1);
    this.checkRow(2);
    this.checkRow(3);
    this.checkRow(4);
    this.checkRow(5);
    this.checkRow(6);
    this.checkRow(7);
    this.checkRow(8);

    this.checkColumn(0);
    this.checkColumn(1);
    this.checkColumn(2);
    this.checkColumn(3);
    this.checkColumn(4);
    this.checkColumn(5);
    this.checkColumn(6);
    this.checkColumn(7);
    this.checkColumn(8);

    this.checkBlock(0);
    this.checkBlock(1);
    this.checkBlock(2);
    this.checkBlock(3);
    this.checkBlock(4);
    this.checkBlock(5);
    this.checkBlock(6);
    this.checkBlock(7);
    this.checkBlock(8);

    for (let x = 0, id = 0; x < 9; x++) {
      for (let y = 0; y < 9; y++) {
        this.checkCell(id);
        id++;
      }
    }

    console.table(this.possibilites);
  }

  getSolution() {
    return this.#solution;
  }

  getPossibilites() {
    return this.possibilites;
  }

  getMissingValuesFromArray(array: Array<number>) {
    const missingValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const newArray = [...array].filter((x) => x !== 0);
    return missingValues.filter((y) => !newArray.includes(y));
  }

  getRow(nb: number) {
    return this.#solution[nb];
  }

  getColumn(nb: number) {
    return this.getSolution().map((value) => value[nb]);
  }

  getBlock(nb: number) {
    let startX = Math.floor(nb / 3) * 3;
    let startY = (nb % 3) * 3;

    let block = [];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        block.push(this.getSolution()[startX + x][startY + y]);
      }
    }
    return block;
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
    let nb = ((Math.floor(posX / 3)) + Math.floor(posY / 3));


    console.log('BLOCKNB', nb, posX, posY)

    // const index = posX * 9 + posY;

    // // Find wich block the cell is a part of
    // let currentBlockNb = Math.floor(posX / 3) + 1 + Math.floor(posY / 3) + 1;

    // let startX = posX - (posX - 3 * Math.floor(posX / 3));
    // let startY = Math.floor(posY / 3) * 3;

    // let blockArray = [];

    // for (let x = 0; x < 3; x++) {
    //   for (let y = 0; y < 3; y++) {
    //     blockArray.push(this.getSolution()[startX + x][startY + y]);
    //   }
    // }

    const block = this.getBlock(nb);

    return this.isDuplicateInArray(value, block);
  }

  findLastValueFromArray(array: Array<number>) {
    return 45 - array.reduce((a, b) => a + b);
  }

  insertValueInCell(value: number, posX: number, posY: number) {
    if (this.#solution[posX][posY] === 0) {
      console.log(`${value} was INSERTED in cell [${posX}, ${posY}]`);
      this.#solution[posX][posY] = value;
      this.updatePossibilities(value, posX, posY);
    }
  }

  updatePossibilities(value: number, posX: number, posY: number) {
    this.possibilites[posX][posY] = [];
    this.updatePossibiltiesInRow(value, posX);
    this.updatePossibiltiesInColumn(value, posY);
  }

  updatePossibiltiesInRow(value: number, row: number) {
    for (let nb = 0; nb < 9; nb++) {
      this.possibilites[row][nb] = this.possibilites[row][nb].filter((x) => x !== value)
    }
  }

  updatePossibiltiesInColumn(value: number, col: number) {
    for(let x = 0; x < 9; x++) {
      this.possibilites[x][col] = this.possibilites[x][col].filter( (x) => x !== value);
    }
  }

  // updatePossibiltieInBlock(value: number, posX: number, posY: number) {
  //   // // const index = posX * 9 + posY;
  //   // // // Find wich block the cell is a part of
  //   // // let currentBlockNb = Math.floor(posX / 3) + 1 + Math.floor(posY / 3) + 1;
  //   // let startX = posX - (posX - 3 * Math.floor(posX / 3));
  //   // let startY = Math.floor(posY / 3) * 3;
  //   // let blockArray = [];
  //   // for (let x = 0; x < 3; x++) {
  //   //   for (let y = 0; y < 3; y++) {
  //   //     blockArray.push(this.getSolution()[startX + x][startY + y]);
  //   //   }
  //   // }
  //   // return this.isDuplicateInArray(value, blockArray);
  // }

  // Check if there is only one possibility left for a number in the current column/row/block and insert it
  checkAndinsertLastPossibilityForArray(possibilites: potentialValuesMap) {
    Object.keys(possibilites).map((key) => {
      if (possibilites[key].length === 1) {
        const [posX, posY] = possibilites[key][0];
        this.insertValueInCell(Number(key), posX, posY);
      }
    });
  }

  hasArrayPairs(array: Array<number>, possibilites: potentialValuesMap) {
    if (Object.keys(possibilites).length < 3) return;

    const temparray = Object.keys(possibilites).map((key) => {
      console.log(key);
      console.log(possibilites[key]);
      {
        values: possibilites[key];
      }
    });
    let pairs = [];
  }

  checkRow(rowNb: number) {
    const row = this.getRow(rowNb);
    if (this.isArrayComplete(row)) return;

    const missingValues = this.getMissingValuesFromArray(row);

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

    this.checkAndinsertLastPossibilityForArray(missingValuesPossibilites);

    if (this.isArrayMissingOne(row)) {
      console.log(`Inserted by isArrayMissingOne row ${rowNb}`);
      this.insertValueInCell(
        this.findLastValueFromArray(row),
        rowNb,
        row.indexOf(0),
      );
    }
    this.hasArrayPairs(row, missingValuesPossibilites);
  }

  checkColumn(columnNb: number) {
    const column = this.getColumn(columnNb);
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

    this.checkAndinsertLastPossibilityForArray(missingValuesPossibilites);

    if (this.isArrayMissingOne(column)) {
      console.log(`Inserted by isArrayMissingOne column ${columnNb}`);
      this.insertValueInCell(
        this.findLastValueFromArray(column),
        column.indexOf(0),
        columnNb,
      );
    }
  }

  checkBlock(blockNb: number) {
    // let currentBlockNb =
    //   Math.floor(posX / 3) + 1 + Math.floor(posY / 3) + 1;
    const block = this.getBlock(blockNb);
    const missingValues = this.getMissingValuesFromArray(block);

    let missingValuesPossibilites: potentialValuesMap = {};
    
    let startingX = Math.floor(blockNb / 3) * 3;
    let startingY = (blockNb % 3) * 3;
    let valueIndex = 0;
    let cellIndex = 0;

    while (valueIndex < missingValues.length) {
      let value = missingValues[valueIndex];

      let allowedValues: Array<allowedValue> = [];

      let currentPosX = startingX;
      while (currentPosX < startingX + 3) {
        let currentPosY = startingY;

        while (currentPosY < startingY + 3) {
          // console.log(`Watching [${currentPosX}, ${currentPosY}]`);
          if (this.isCellEmpty(currentPosX, currentPosY)) {
            if (
              this.isAllowedInRow(value, currentPosX) &&
              this.isAllowedInColumn(value, currentPosY)
            ) {
              if (missingValuesPossibilites[value]) {
                missingValuesPossibilites[value] = [
                  ...missingValuesPossibilites[value],
                  [currentPosX, currentPosY],
                ];
              } else {
                missingValuesPossibilites[value] = [[currentPosX, currentPosY]];
              }
              allowedValues.push({
                row: currentPosX,
                column: currentPosY,
                value: value,
              });
            }
          }
          currentPosY++;
          cellIndex++;
        }
        currentPosX++;
      }

      if (cellIndex === 9) {
        if (allowedValues.length === 1) {
          this.insertValueInCell(
            allowedValues[0].value,
            allowedValues[0].row,
            allowedValues[0].column,
          );
        }
      }

      valueIndex++;
    }

    this.checkAndinsertLastPossibilityForArray(missingValuesPossibilites);

    if (this.isArrayMissingOne(block)) {
      console.log(`Inserted by isArrayMissingOne block ${blockNb}`);

      const index = block.indexOf(0);

      let posX = Math.floor(index / 3) * 3;
      let posY = (index % 3) * 3;

      console.log(`Inserted by findLastValueFromArray block ${blockNb}`);
      this.insertValueInCell(this.findLastValueFromArray(block), posX, posY);
    }
  }

  checkCell(cellNb: number) {
    // const index = posX * 9 + posY;

    const posX = Math.floor(cellNb / 9);
    const posY = cellNb % 9;

    if (!this.isCellEmpty(posX, posY)) return;

    let allowedValues = [];
    let value = 1;

    while (value < 10) {
      if (this.isAllowedInCell(value, posX, posY)) {
        // console.log(`${value} is allowed in cell [${posX}, ${posY}]`);
        allowedValues.push(value);
      }
      value++;
    }

    // console.log(cellNb, posX, posY);

    if (value > 9) {
      if (allowedValues.length === 1) {
        console.log(
          `${allowedValues[0]} was inserted by checkCell in [${posX}, ${posY}]`,
        );
        this.insertValueInCell(allowedValues[0], posX, posY);
      }
    }
  }
}
