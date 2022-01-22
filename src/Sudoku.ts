import Cell from './Cell';
import Solver from './Solver';
import Sudokus from './sudokus.json';

export default class Sudoku {
  el: HTMLElement;
  cells: Array<Cell>;
  originalMap: Array<Array<number>>;
  #currentMap: Array<Array<number>>;
  isSolved: boolean = false;

  constructor(el: HTMLElement) {
    this.el = el;
    this.cells = [];
    this.originalMap = Sudokus.hard[1];

    this.setCurrentMap(this.originalMap);
    this.display();
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
        self.cells.push(cellItem);
        fragment.appendChild(cellElement);
        id++;
      });
    });

    const solveBtn = document.createElement('button');
    solveBtn.textContent = 'Solve';
    solveBtn.classList.add('btn', 'btn-solve');
    solveBtn.addEventListener('click', () => {
      this.validate();
    });

    this.el.parentNode.querySelector('.sudoku__info').appendChild(solveBtn);
    this.el.classList.add('sudoku-grid');
    this.el.appendChild(fragment);
  }

  displaySolution(solution: Array<Array<number>>) {
    const values = [].concat(...solution);
    this.cells.forEach((cell, index) => {
      const val = values[index];
      if (val !== 0) {
        cell.setValue(val);
      }
    });
    this.el.parentNode.querySelector('.btn-solve').classList.add('--is-solved');
  }

  handleCellValueChanged(value: number, cell: Cell) {
    const updatedMap = [...this.getCurrentMap()];
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    updatedMap[x][y] = currentValue;

    this.setCurrentMap(updatedMap);
  }

  validate() {
    if (this.isSolved) return;
    let errors = [];
    const solver = new Solver([...this.getCurrentMap()]);
    solver.solve();
    this.displaySolution(solver.getSolution());
    this.isSolved = true;
  }
}
