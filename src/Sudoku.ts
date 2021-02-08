import Observer from './Observer';
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
    let fragment = new DocumentFragment();
    for (const row of this.originalMap) {
      for (const cell of row) {
        const cellItem = new Cell(cell);
        const observer = new Observer();
        cellItem.attach(observer);
        const cellElement = cellItem.getCell();

        fragment.appendChild(cellElement);
      }
    }
    this.el.classList.add('sudoku-grid');
    this.el.appendChild(fragment);
  }

  handleClickOnCell(e: event, cell: Cell) {
    // e.stopPropagation();
    console.log(e.target);
    console.log(cell);
  }
}
