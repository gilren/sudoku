import Cell from './Cell';
import Solver from './Solver';
import Sudokus from './sudokus.json';

export default class Sudoku {
  el: HTMLElement;
  cells: Array<Cell>;
  originalMap: Array<Array<number>>;
  currentMap: Array<Array<number>>;
  isSolved: boolean = false;

  constructor(el: HTMLElement) {
    this.el = el;
    this.cells = [];
    this.originalMap = Sudokus.hard[1].map((arr) => arr.slice());

    this.setCurrentMap(Sudokus.hard[1].map((arr) => arr.slice()));
    this.display();
  }

  setCurrentMap(value: Array<Array<number>>) {
    this.currentMap = value;
  }

  getOriginalMap() {
    return this.originalMap;
  }

  getCurrentMap() {
    return this.currentMap;
  }

  validate() {
    if (this.isSolved) return;
    let errors = [];
    const solver = new Solver(
      this.getOriginalMap().map((arr) => arr.slice()),
      this.getCurrentMap().map((arr) => arr.slice()),
    );
    solver.solve();
    this.displaySolution(solver.getSolution());
    this.isSolved = true;
  }

  display() {
    const self = this;

    let fragment = new DocumentFragment();

    let id = 0;
    this.originalMap.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellItem = new Cell(cell, id, { x, y });
        const cellElement = cellItem.getCell();

        cellItem.on('valueChanged', () =>
          self.handleCellValueChanged(cellItem),
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

  handleCellValueChanged(cell: Cell) {
    const updatedMap = this.getCurrentMap().map((arr) => arr.slice());
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    updatedMap[x][y] = currentValue;

    this.setCurrentMap(updatedMap);
  }

  displaySolution(solution: Array<Array<number>>) {
    const values = [].concat(...solution);
    this.cells.forEach((cell, index) => {
      const val = values[index];
      if (val !== 0) {
        cell.setSolutionValue(val);
      }
    });
    this.el.parentNode.querySelector('.btn-solve').classList.add('--is-solved');
  }
}
