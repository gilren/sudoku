import Cell from './Cell';
import { BOARD_SIZE, DIFFICULTY_EASY } from './constants';
import Solver from './Solver';

import { Action, Board, Difficulty, Duplicate } from './types';
import UIManager from './UiManager';
import UndoManager from './UndoManager';
import { isDifficulty } from './utils';

export default class Sudoku {
  uiManager: UIManager;

  initialBoard: Board;
  activeBoard: Board;
  solutionBoard: Board;
  gridCells: Array<Cell>;
  errors: Array<Duplicate> | null;
  undoManager: UndoManager;

  timer: NodeJS.Timeout | null;
  isSolved: boolean;
  isLoading: boolean;

  constructor(el: HTMLElement) {
    this.isSolved = false;
    this.isLoading = false;

    this.initialBoard = null;
    this.activeBoard = null;
    this.solutionBoard = null;
    this.gridCells = [];
    this.errors = null;

    this.timer = null;

    this.uiManager = new UIManager(el);
    this.undoManager = new UndoManager();
    this.new();
  }

  async new() {
    if (this.isLoading) return;
    this.isLoading = true;
    try {
      this.reset();
      this.startTimer();
      this.uiManager.initializeUI();
      await this.init(this.getDifficulty());
    } finally {
      this.isLoading = false;
    }
  }

  reset() {
    this.stopTimer();
    this.gridCells = [];
    this.errors = null;
    this.isSolved = false;
    this.undoManager.clear();
    this.uiManager.clear();
  }

  async init(difficulty: Difficulty) {
    await this.load(difficulty);

    this.gridCells = [];
    this.uiManager.render(
      this.initialBoard,
      this.gridCells,
      difficulty,
      (info: object) => this.handleCellValueChange(info),
    );

    this.uiManager.onUndoKeyListener(() => this.undo());
    this.uiManager.onNewClicked(() => this.new());
    // this.uiManager.onSolveClicked(() =>
    //   this.uiManager.displaySolution(this.solutionBoard, this.gridCells),
    // );
    this.uiManager.onValidateClicked(() => this.validate());
    this.uiManager.onDifficultyChanged((newDifficulty) =>
      this.changeDifficulty(newDifficulty),
    );
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
    if (!this.activeBoard || !this.solutionBoard) {
      console.error('Active board or solution is null');
      return;
    }

    this.errors = [];
    for (let gridCell of this.gridCells) {
      this.uiManager.removeInvalidIndicator(gridCell);
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

      for (let duplicate of errors) {
        const cell = this.gridCells.find((cell) => cell.id === duplicate.id);
        if (cell) {
          this.uiManager.addInvalidIndicator(cell);
        }
      }

      return console.error('Sudoku has errors');
    } else {
      return console.log('Sudoku is valid');
    }
  }

  startTimer() {
    const startTime = new Date().getTime();

    const updateTimer = () => {
      let now = new Date().getTime();
      let elapsedTime = now - startTime;
      let seconds = Math.floor((elapsedTime / 1000) % 60);
      let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
      let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);

      this.uiManager.updateTimerText(hours, minutes, seconds);
    };

    this.timer = setInterval(updateTimer, 1000);
    updateTimer();
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  handleCellValueChange(info: object) {
    if (!this.activeBoard) return;

    const { id, oldValue, oldMarkers, newValue } = info;

    const cell = this.gridCells.find((c) => c.id === id);
    if (!cell) return;
    const { x, y } = cell.coords;
    const action: Action = {
      id: cell.id,
      value: oldValue,
      markers: oldMarkers,
    };
    this.undoManager.store(action);

    this.activeBoard[x][y] = newValue;
  }

  changeDifficulty(newDifficulty: string) {
    if (this.isLoading) return;
    localStorage.setItem('difficulty', newDifficulty);
    this.reset();
    this.new();
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

  undo() {
    if (!this.activeBoard) return;
    const lastAction = this.undoManager.undo();
    if (lastAction) {
      const { id, value, markers } = lastAction;
      const cell = this.gridCells.find((c) => c.id === id);

      if (!cell) return;

      this.activeBoard[cell.coords.x][cell.coords.y] = value;

      cell.setValue(value, markers, true);
    }
  }
}
