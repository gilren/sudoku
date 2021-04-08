import Cell from './Cell';
import Solver from './Solver';
import Sudokus from './sudokus.json';

export default class Sudoku {
  el: HTMLElement;
  cells: Array<Cell>;
  originalMap: Array<Array<number>>;
  #currentMap: Array<Array<number>>;

  constructor(el: HTMLElement) {
    this.el = el;
    this.cells = [];
    this.originalMap = Sudokus.hard[0];

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
        self.cells.push(cellItem);
        fragment.appendChild(cellElement);
        id++;
      });
    });

    const solveBtn = document.createElement('button');
    solveBtn.textContent = 'Solve';
    solveBtn.addEventListener('click', () => {
      this.validate();
    });

    this.el.classList.add('sudoku-grid');
    this.el.parentNode.appendChild(solveBtn);
    this.el.appendChild(fragment);

    this.validate();
  }

  displaySolution(solution: Array<Array<number>>, possibilites: Array<Array<Array<number>>>) {
    const values = [].concat(...solution);
    const possibilitesValues = [].concat(...possibilites)
    this.cells.forEach((cell, index) => {
      const val = values[index];
      if (val !== 0) {
        cell.setValue(val);
      }
      cell.setPossibilities(possibilitesValues[index]);
      
    });
  }

  handleCellValueChanged(value: number, cell: Cell) {
    console.log(cell);
    console.log(cell.coords);
    const updatedMap = [...this.getCurrentMap()];
    const { currentValue } = cell;
    const { x, y } = cell.coords;

    updatedMap[x][y] = currentValue;

    this.setCurrentMap(updatedMap);
  }

  validate() {
    let errors = [];

    const solver = new Solver([...this.getCurrentMap()]);
    solver.solve();
    const possibilities = solver.getPossibilites()
    this.displaySolution(solver.getSolution(), possibilities);
  }
}
