import Cell from './Cell';
import {
  DIFFICULTY_EASY,
  DIFFICULTY_MEDIUM,
  DIFFICULTY_HARD,
  DIFFICULTY_EXPERT,
  DIFFICULTY_MASTER,
} from './constants';

import { Board } from './types';

export default class UIManager {
  containerEl: HTMLElement;
  wrapper: HTMLDivElement;
  infosContainer: HTMLDivElement;
  restartBtn: HTMLButtonElement;
  validateBtn: HTMLButtonElement;
  newGameBtn: HTMLButtonElement;
  undoBtn: HTMLButtonElement;
  difficultySelector: HTMLSelectElement;
  timerEl: HTMLDivElement;
  grid: HTMLDivElement;

  private newGameBtnListener: () => void;
  private restartBtnListener: () => void;
  private validateBtnListener: () => void;
  private undoKeyListener: (event: KeyboardEvent) => void;

  constructor(containerEl: HTMLElement) {
    this.containerEl = containerEl;
    this.wrapper = document.createElement('div');
    this.infosContainer = document.createElement('div');
    this.restartBtn = document.createElement('button');
    this.validateBtn = document.createElement('button');
    this.newGameBtn = document.createElement('button');
    this.undoBtn = document.createElement('button');
    this.restartBtn = document.createElement('button');
    this.timerEl = document.createElement('div');
    this.grid = document.createElement('div');
    this.difficultySelector = document.createElement('select');

    this.newGameBtnListener = () => {};
    this.restartBtnListener = () => {};
    this.validateBtnListener = () => {};
    this.undoKeyListener = () => {};
  }

  initializeUI() {
    this.wrapper.classList.add('sudoku');
    this.grid.classList.add('sudoku__grid');
    this.infosContainer.classList.add('sudoku__infos');

    this.restartBtn.textContent = 'Restart';
    this.restartBtn.classList.add('btn', 'btn-restart');

    this.validateBtn.textContent = 'Validate';
    this.validateBtn.classList.add('btn', 'btn-validate');

    this.newGameBtn.textContent = 'New';
    this.newGameBtn.classList.add('btn', 'btn-new-game');

    this.timerEl.classList.add('timer');

    this.infosContainer.appendChild(this.difficultySelector);
    this.infosContainer.appendChild(this.validateBtn);
    this.infosContainer.appendChild(this.restartBtn);
    this.infosContainer.appendChild(this.newGameBtn);
    this.infosContainer.appendChild(this.timerEl);
    this.wrapper.appendChild(this.infosContainer);
    this.wrapper.appendChild(this.grid);

    this.containerEl.appendChild(this.wrapper);
  }

  populateDifficultySelector(
    options: Array<string>,
    currentDifficulty: string,
  ) {
    this.difficultySelector.innerHTML = '';
    options.forEach((difficulty) => {
      const option = document.createElement('option');
      option.value = difficulty;
      option.text = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
      this.difficultySelector.appendChild(option);
    });
    this.difficultySelector.value = currentDifficulty;
  }

  updateTimerText(hours: number, minutes: number, seconds: number) {
    let text = '';
    if (hours > 0) text += `${hours}H `;
    if (minutes > 0) text += `${minutes}M `;
    text += `${seconds}S`;
    this.timerEl.textContent = text;
  }

  onNewClicked(callback: () => void) {
    this.newGameBtnListener = callback;
    this.newGameBtn.addEventListener('click', callback);
  }

  onrestartClicked(callback: () => void) {
    this.restartBtnListener = callback;
    this.restartBtn.addEventListener('click', callback);
  }

  onValidateClicked(callback: () => void) {
    this.validateBtnListener = callback;
    this.validateBtn.addEventListener('click', callback);
  }

  onDifficultyChanged(callback: (value: string) => void) {
    this.difficultySelector.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLSelectElement;
      callback(target.value);
    });
  }

  onUndoKeyListener(callback: () => void) {
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event?.preventDefault();
        callback();
      }
    });
  }

  render(
    board: Board,
    gridCells: Array<Cell>,
    currentDifficulty: string,
    handleCellValueChange: (info: object) => void,
  ) {
    this.populateDifficultySelector(
      [
        DIFFICULTY_EASY,
        DIFFICULTY_MEDIUM,
        DIFFICULTY_HARD,
        DIFFICULTY_EXPERT,
        DIFFICULTY_MASTER,
      ],
      currentDifficulty,
    );
    if (!board) return;
    this.grid.innerHTML = '';

    let id = 0;
    board.forEach((row, x) => {
      row.forEach((cellValue, y) => {
        const cell = new Cell(cellValue, id, { x, y });
        const cellElement = this.createCellUI(cell);

        cell.on('valueChanged', (info: object) => handleCellValueChange(info));

        gridCells.push(cell);
        this.grid.appendChild(cellElement);
        id++;
      });
    });
  }

  createCellUI(cell: Cell): HTMLElement {
    const cellEl = document.createElement('div');
    const valueEl = document.createElement('div');
    let markersEl = null;
    valueEl.classList.add('number-container');

    cellEl.id = cell.id.toString();

    cellEl.classList.add('cell');
    if (cell.isDefault) {
      cellEl.classList.add('cell-default');
      valueEl.textContent = cell.currentValue.toString();
    } else {
      markersEl = document.createElement('div');
      markersEl.classList.add('marker-container');
      for (let i = 1; i < 10; i++) {
        const marker = document.createElement('span');
        marker.textContent = i.toString();
        marker.classList.add('marker');
        markersEl.appendChild(marker);
      }

      this.attachCellListeners(cell, cellEl);
      cellEl.appendChild(markersEl);
    }

    cellEl.appendChild(valueEl);

    return cellEl;
  }

  attachCellListeners(cell: Cell, cellElement: HTMLElement) {
    cellElement.addEventListener('mouseenter', (e: MouseEvent) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.add('cell-hover');
      }
    });

    cellElement.addEventListener('mouseleave', (e: MouseEvent) => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.classList.remove('cell-hover');
      }
    });

    cellElement.addEventListener('click', (e) => {
      cell.handleClick(e);
    });

    cell.on('markersChanged', () => {
      this.updateCellUI(cellElement, cell);
    });

    cell.on('valueChanged', () => {
      this.updateCellUI(cellElement, cell);
    });
  }

  // Might need to modify the solution display, either keep the overlay or replace the values directly and play with classes
  // displaySolution(solution: Board, gridCells: Array<Cell>) {
  //   if (!solution) return;
  //   const values = solution.flat();

  //   gridCells.forEach((cell, index) => {
  //     const val = values[index];
  //     if (!cell.isDefault) {
  //       cell.showSolution(val);
  //     }
  //   });
  //   this.restartBtn.classList.add('--is-restartd');
  // }

  addInvalidIndicator(cell: Cell) {
    this.grid.querySelector(`#${cell.id}`).classList.add('cell--invalid');
  }

  removeInvalidIndicator(cell: Cell) {
    this.grid.children.item(cell.id).classList.remove('cell--invalid');
  }

  updateCellUI(cellElement: HTMLElement, cell: Cell) {
    const value = cell.currentValue;
    const valueContainer = cellElement.querySelector('.number-container');
    if (!valueContainer) return;
    this.removeInvalidIndicator(cell);
    valueContainer.textContent = value === 0 ? '' : value.toString();

    const markers = cell.markers;
    const markerContainer = cellElement.querySelector('.marker-container');
    if (!markerContainer) return;

    if (markers.length > 1) {
      cellElement.classList.remove('has-markers');
    } else {
      cellElement.classList.add('has-markers');
    }

    for (let marker of markerContainer.children) {
      marker.classList.remove('selected');
    }
    markers.forEach((value) => {
      markerContainer.children.item(value - 1)?.classList.add('selected');
    });
  }

  clear() {
    document.removeEventListener('keydown', this.undoKeyListener);
    this.newGameBtn.removeEventListener('click', this.newGameBtnListener);
    this.restartBtn.removeEventListener('click', this.restartBtnListener);
    this.validateBtn.removeEventListener('click', this.validateBtnListener);

    this.wrapper.innerHTML = '';

    this.updateTimerText(0, 0, 0);
  }
}
