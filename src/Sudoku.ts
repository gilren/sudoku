import Cell from './Cell';

export default class Soduku {
  el: HTMLElement;
  originalMap: Array<Array<number>>;
  #currentMap: Array<Array<number>>;

  constructor(el: HTMLElement) {
    console.log('Sudoku');
    this.el = el;
    this.originalMap = [
      [0, 0, 0, 0, 0, 0, 6, 0, 9],
      [0, 3, 4, 8, 0, 9, 0, 0, 0],
      [2, 0, 1, 0, 0, 0, 0, 7, 0],
      [0, 5, 6, 0, 8, 0, 0, 0, 2],
      [0, 8, 0, 5, 1, 2, 0, 4, 0],
      [7, 0, 0, 0, 9, 0, 3, 5, 0],
      [0, 2, 0, 0, 0, 0, 4, 0, 1],
      [0, 0, 0, 1, 0, 5, 9, 6, 0],
      [1, 0, 9, 0, 0, 0, 0, 0, 0],
    ];

    this.setCurrentMap(this.originalMap);
    this.display();

    // console.log(this.getCurrentMap());
  }

  setCurrentMap(value: Array<Array<number>>) {
    this.#currentMap = value;
  }

  getCurrentMap() {
    return this.#currentMap;
  }

  display() {
    const self = this;
    let fragment = new DocumentFragment();

    for (let [index, val] of this.originalMap.entries()) {
    }

    let id = 0;
    this.originalMap.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellItem = new Cell(cell, id, { x, y });
        const cellElement = cellItem.getCell();

        cellItem.on('valueChanged', (value: number) =>
          self.handleCellValueChanged(value, cellItem),
        );
        fragment.appendChild(cellElement);
        id++;
      });
    });

    this.el.classList.add('sudoku-grid');
    this.el.appendChild(fragment);
  }

  handleCellValueChanged(value: number, cell: Cell) {
    console.log(cell);
    const updatedMap = [...this.getCurrentMap()];
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    updatedMap[x][y] = currentValue;

    this.setCurrentMap(updatedMap);

    //columns
    updatedMap.forEach((row, coordX) => {
      console.log(row[1]);
      console.log(coordX);
      const coordY = 1;
      if (currentValue === 0 || [x, y] === [coordX, coordY]) return;
      if (row[1] === currentValue) {
        console.log('error');
      }
    });

    console.log(this.#currentMap);
  }

  // checkDuplicate()
}
