import Cell from './Cell';
import {
  BOARD_SIZE,
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from './constants';
import Solver from './Solver';

import { Board, Difficulty, Duplicate } from './types';
import { createButton, isDifficulty } from './utils';

export default class Sudoku {
  containerEl: HTMLElement;
  wrapper: HTMLDivElement;
  infosContainer: HTMLDivElement;
  solveBtn: HTMLButtonElement;
  validateBtn: HTMLButtonElement;
  newGameBtn: HTMLButtonElement;
  difficultySelector: HTMLSelectElement;
  timerEl: HTMLDivElement;
  grid: HTMLDivElement;

  initialBoard: Board;
  activeBoard: Board;
  solutionBoard: Board;
  gridCells: Array<Cell>;
  errors: Array<Duplicate> | null;

  timer: NodeJS.Timeout | null;
  isSolved: boolean;
  hasGameStarted: boolean;

  constructor(el: HTMLElement) {
    this.isSolved = false;
    this.hasGameStarted = false;

    this.containerEl = el;
    this.wrapper = document.createElement('div');
    this.infosContainer = document.createElement('div');
    this.solveBtn = document.createElement('button');
    this.validateBtn = document.createElement('button');
    this.newGameBtn = document.createElement('button');
    this.timerEl = document.createElement('div');
    this.grid = document.createElement('div');
    this.difficultySelector = document.createElement('select');

    this.initialBoard = null;
    this.activeBoard = null;
    this.solutionBoard = null;
    this.gridCells = [];
    this.errors = null;

    this.timer = null;

    this.init(this.getDifficulty());
  }

  async init(difficulty: Difficulty) {
    await this.load(difficulty);
    this.display();
  }

  async load(difficulty: Difficulty): Promise<void> {
    try {
      const sudokus = (await import(`../sudokus/${difficulty}.json`)).default;

      this.initialBoard = sudokus[
        Math.floor(Math.random() * sudokus.length)
      ].map((arr: Array<number>) => [...arr]);

      this.activeBoard = this.initialBoard;

      console.log(`Loading Sudoku with difficulty ${difficulty}`);
      this.getSolution();
    } catch (error) {
      console.error(
        `Error loading Sudoku for difficulty ${difficulty}:`,
        error,
      );
      throw error;
    }
  }

  finish() {
    this.stopTimer();
  }

  validate() {
    console.log('hello');
    if (!this.activeBoard || !this.solutionBoard) {
      console.error('Active board or solution is null');
      return;
    }

    // reset grid states

    this.errors = [];
    for (let gridCell of this.gridCells) {
      gridCell.el.classList.remove('cell--invalid');
    }

    let errors: Array<Duplicate> = [];

    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let y = 0; y < BOARD_SIZE; y++) {
        const current = this.activeBoard[x][y];
        if (current === 0) continue;
        if (current !== this.solutionBoard[x][y]) {
          const error: Duplicate = {
            value: current,
            id: x * BOARD_SIZE + y,
          };
          errors.push(error);
        }
      }
    }

    if (errors.length > 0) {
      this.errors = errors;

      console.log(errors);

      for (let duplicate of errors) {
        const cell = this.gridCells.find((cell) => cell.id === duplicate.id);
        if (cell) {
          cell.el.classList.add('cell--invalid');
        }
      }

      return console.error('Sudoku has errors');
    } else {
      return console.log('Sudoku is valid');
    }
  }

  display() {
    if (!this.initialBoard) return;
    const self = this;
    const fragment = new DocumentFragment();

    this.wrapper.classList.add('sudoku');

    const options = [
      DIFFICULTY_EASY,
      DIFFICULTY_MEDIUM,
      DIFFICULTY_HARD,
      DIFFICULTY_EXPERT,
      DIFFICULTY_MASTER,
    ];

    //Create and append the options
    for (var i = 0; i < options.length; i++) {
      const capitalized =
        options[i].charAt(0).toUpperCase() + options[i].slice(1);
      var option = document.createElement('option');
      option.value = options[i];
      option.text = capitalized;
      this.difficultySelector.appendChild(option);
    }

    this.difficultySelector.value = this.getDifficulty();

    this.difficultySelector.addEventListener('change', (e) => {
      this.handleSelectChange(e);
    });

    this.infosContainer.classList.add('sudoku__infos');

    this.solveBtn.textContent = 'Solve';
    this.solveBtn.classList.add('btn', 'btn-solve');

    this.solveBtn.addEventListener('click', () => {
      this.displaySolution();
    });

    this.validateBtn.textContent = 'Validate';
    this.validateBtn.classList.add('btn', 'btn-validate');

    this.validateBtn.addEventListener('click', () => {
      this.validate();
    });

    this.newGameBtn.textContent = 'New';
    this.newGameBtn.classList.add('btn', 'btn-timer');

    this.newGameBtn.addEventListener('click', () => {});

    this.timerEl.classList.add('timer');

    this.infosContainer.appendChild(this.difficultySelector);
    this.infosContainer.appendChild(this.validateBtn);
    this.infosContainer.appendChild(this.solveBtn);
    this.infosContainer.appendChild(this.newGameBtn);
    this.infosContainer.appendChild(this.timerEl);

    this.grid.classList.add('sudoku__grid');

    let id = 0;
    this.initialBoard.forEach((row, x) => {
      row.forEach((cell, y) => {
        const cellItem = new Cell(cell, id, { x, y });
        const cellElement = cellItem.getCell();

        cellItem.on('valueChanged', () => self.handleCellValueChange(cellItem));

        self.gridCells.push(cellItem);
        self.grid.appendChild(cellElement);
        id++;
      });
    });

    this.wrapper.appendChild(this.infosContainer);

    this.wrapper.appendChild(this.grid);
    fragment.appendChild(this.wrapper);

    this.containerEl.appendChild(fragment);
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
    if (!this.activeBoard) return;
    if (!this.hasGameStarted) {
      this.startTimer();
      this.hasGameStarted = true;
    }
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    cell.el.classList.remove('cell--invalid');
    this.activeBoard[x][y] = currentValue;

    // console.table(this.activeBoard);
  }

  handleSelectChange(e: Event) {
    if (!(e.currentTarget instanceof HTMLSelectElement)) return;
    const value = e.currentTarget.value;

    if (value && isDifficulty(value)) {
      localStorage.setItem('difficulty', value);
      console.log(`Switched difficulty to ${value}`);
    }
  }

  getDifficulty(): Difficulty {
    const difficulty = localStorage.getItem('difficulty');

    if (difficulty && isDifficulty(difficulty)) return difficulty;

    console.log(
      `Difficulty is empty or invalid, setting to ${DIFFICULTY_EASY}`,
    );
    localStorage.setItem('difficulty', DIFFICULTY_EASY);
    return DIFFICULTY_EASY;
  }

  getSolution() {
    if (!this.initialBoard) {
      console.error(`Unable to give solution since board is null`);
      return;
    }
    const solver = new Solver(this.initialBoard);
    solver.solve();

    if (solver.solution) {
      this.solutionBoard = solver.solution;
      this.isSolved = true;
    }
  }

  // Might need to modify the solution display, either keep the overlay or replace the values directly and play with classes
  displaySolution() {
    if (!this.solutionBoard) return;
    this.stopTimer();
    const values = this.solutionBoard.flat();

    this.gridCells.forEach((cell, index) => {
      const val = values[index];
      if (!cell.isDefault && cell.currentValue !== val) {
        cell.showSolution(val);
      }
    });
    this.solveBtn.classList.add('--is-solved');
  }
}
