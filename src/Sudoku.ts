import Cell from './Cell';
import {
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
  newGameBtn: HTMLButtonElement;
  timerEl: HTMLDivElement;
  grid: HTMLDivElement;
  cells: Array<Cell>;
  baseBoard: Board;
  currentBoard: Board;
  timer: NodeJS.Timeout | null;
  isSolved: boolean;
  hasGameStarted: boolean;

  constructor(el: HTMLElement) {
    this.isSolved = false;
    this.hasGameStarted = false;
    this.el = el;
    this.wrapper = document.createElement('div');
    this.infos = document.createElement('div');
    this.solveBtn = document.createElement('button');
    this.newGameBtn = document.createElement('button');
    this.timerEl = document.createElement('div');
    this.grid = document.createElement('div');

    this.baseBoard = null;
    this.currentBoard = null;

    this.cells = [];
    this.timer = null;

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
    if (!this.baseBoard) return;
    if (this.isSolved) return;
    this.stopTimer();
    let errors = [];
    const solver = new Solver(this.baseBoard);
    solver.solve();
    if (solver.solution) {
      this.displaySolution(solver.solution);
      this.isSolved = true;
    }

    console.log('hello');
  }

  display() {
    if (!this.baseBoard) return;
    const self = this;
    const fragment = new DocumentFragment();

    this.wrapper.classList.add('sudoku');

    this.infos.classList.add('sudoku__infos');
    this.solveBtn.textContent = 'Solve';
    this.solveBtn.classList.add('btn', 'btn-solve');

    this.solveBtn.addEventListener('click', () => {
      this.validate();
    });

    this.newGameBtn.textContent = 'New';
    this.newGameBtn.classList.add('btn', 'btn-timer');

    // this.newGameBtn.addEventListener('click', () => {
    //   this.startTimer();
    // });

    this.timerEl.classList.add('timer');

    this.infos.appendChild(this.solveBtn);
    this.infos.appendChild(this.newGameBtn);
    this.infos.appendChild(this.timerEl);

    this.grid.classList.add('sudoku__grid');

    let id = 0;
    this.baseBoard.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellItem = new Cell(cell, id, { x, y });
        const cellElement = cellItem.getCell();

        cellItem.on('valueChanged', () => self.handleCellValueChange(cellItem));

        self.cells.push(cellItem);
        self.grid.appendChild(cellElement);
        id++;
      });
    });

    this.wrapper.appendChild(this.infos);

    this.wrapper.appendChild(this.grid);
    fragment.appendChild(this.wrapper);

    this.el.appendChild(fragment);
  }

  startTimer() {
    const startTime = new Date().getTime();

    this.timerEl.textContent = '';

    const updateTimer = () => {
      let now = new Date().getTime();
      let elapsedTime = now - startTime;
      let seconds = Math.floor((elapsedTime / 1000) % 60);
      let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
      let text = '';
      if (hours > 0) {
        text += `${hours}H`;
      }
      if (minutes > 0) {
        text += `${minutes}M`;
      }
      text += `${seconds}S`;

      this.timerEl.textContent = text;
    };

    updateTimer();

    this.timer = setInterval(updateTimer, 1000);
  }

  stopTimer() {
    if (this.timer) clearInterval(this.timer);
  }

  handleCellValueChange(cell: Cell) {
    if (!this.currentBoard) return;
    if (!this.hasGameStarted) {
      this.startTimer();
      this.hasGameStarted = true;
    }
    const { currentValue } = cell;

    const { x, y } = cell.coords;
    this.currentBoard[x][y] = currentValue;

    // console.table(this.currentBoard);
  }

  displaySolution(solution: Array<Array<number>>) {
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
