import Cell from './Cell';
import Solver from './Solver';
import Sudokus from './sudokus.json';
import { SudokuNumber } from './types';

export default class Sudoku {
  el: HTMLElement;
  cells: Array<Cell>;
  readonly originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>;
  currentMap: Array<Array<SudokuNumber>>;
  isSolved: boolean = false;

  constructor(el: HTMLElement) {
    this.el = el;

    this.cells = [];
    this.originalMap = Sudokus.extreme[0].map((arr) =>
      Object.freeze([...arr]),
    ) as ReadonlyArray<ReadonlyArray<SudokuNumber>>;

    this.setCurrentMap(Sudokus.hard[1].map((arr) => arr.slice()));
    this.display();
  }

  validate() {
    if (this.isSolved) return;
    let errors = [];
    const solver = new Solver(
      this.originalMap,
      this.currentMap.map((arr) => [...arr]),
    );
    solver.solve();
    this.displaySolution(solver.solution);
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
    const updatedMap = this.currentMap.map((arr) => [...arr]);
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    updatedMap[x][y] = currentValue;

    this.currentMap = updatedMap;
    // console.table(this.currentMap);
  }

  displaySolution(solution: Array<Array<SudokuNumber>>) {
    const values = solution.flat();
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
