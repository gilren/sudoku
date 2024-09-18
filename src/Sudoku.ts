import Cell from './Cell';
import {
  DIFFICULTY_EASY,
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from './constants';
import Solver from './Solver';

import { Board, Difficulty } from './types';

export default class Sudoku {
  el: HTMLElement;
  wrapper: HTMLDivElement;
  infos: HTMLDivElement;
  solveBtn: HTMLButtonElement;
  sudokuGrid: HTMLDivElement;
  cells: Array<Cell>;
  readonly originalMap: ReadonlyArray<ReadonlyArray<SudokuNumber>>;
  currentMap: Array<Array<SudokuNumber>>;
  isSolved: boolean = false;

  constructor(el: HTMLElement) {
    this.el = el;
    this.wrapper = document.createElement('div');
    this.infos = document.createElement('div');
    this.solveBtn = document.createElement('button');
    this.sudokuGrid = document.createElement('div');

    this.cells = [];
    this.originalMap = Sudokus.easy[0].map((arr) =>
      Object.freeze([...arr]),
    ) as ReadonlyArray<ReadonlyArray<SudokuNumber>>;

    this.init(DIFFICULTY_EASY);
  }

  async init(difficulty: Difficulty) {
    await this.load(difficulty);
    this.display();
  }

  async load(difficulty: Difficulty): Promise<void> {
    try {
      const sudokus = (await import(`../sudokus/${difficulty}.json`)).default;

      this.baseBoard = sudokus[Math.floor(Math.random() * sudokus.length)].map(
        (arr: Array<number>) => [...arr],
      );

      this.currentBoard = this.baseBoard;

      console.log(`Loading Sudoku with difficulty ${difficulty}`);
    } catch (error) {
      console.error(
        `Error loading Sudoku for difficulty ${difficulty}:`,
        error,
      );
      throw error;
    }
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

    console.log('hello');
  }

  display() {
    const self = this;
    const fragment = new DocumentFragment();

    this.wrapper.classList.add('sudoku');

    this.infos.classList.add('sudoku__infos');
    this.solveBtn.textContent = 'Solve';
    this.solveBtn.classList.add('btn', 'btn-solve');

    this.solveBtn.addEventListener('click', () => {
      this.validate();
    });

    this.infos.appendChild(this.solveBtn);

    this.sudokuGrid.classList.add('sudoku__grid');

    let id = 0;
    this.originalMap.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellItem = new Cell(cell, id, { x, y });
        const cellElement = cellItem.getCell();

        cellItem.on('valueChanged', () => self.handleCellValueChange(cellItem));

        self.cells.push(cellItem);
        self.sudokuGrid.appendChild(cellElement);
        id++;
      });
    });

    this.wrapper.appendChild(this.infos);

    this.wrapper.appendChild(this.sudokuGrid);
    fragment.appendChild(this.wrapper);

    this.el.appendChild(fragment);
  }

  handleCellValueChange(cell: Cell) {
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    this.currentMap[x][y] = currentValue;

    // console.table(this.currentMap);
  }

  displaySolution(solution: Array<Array<SudokuNumber>>) {
    const values = solution.flat();

    this.cells.forEach((cell, index) => {
      const val = values[index];
      if (!cell.isDefault) {
        cell.showSolution(val);
      }
    });
    this.solveBtn.classList.add('--is-solved');
  }
}
