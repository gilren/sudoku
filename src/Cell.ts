import EventEmitter from './EventEmitter';
import { SudokuNumber } from './types';

interface CoordsType {
  x: number;
  y: number;
}

export default class Cell extends EventEmitter {
  markers: Array<SudokuNumber> = [];

  el: HTMLDivElement;
  currentValue: SudokuNumber = 0;
  solutionValue: SudokuNumber = 0;
  id: number;
  coords: CoordsType;
  isDefault: Boolean;

  constructor(value: SudokuNumber, id: number, coords: CoordsType) {
    super();
    this.id = id;
    this.currentValue = value;

    this.coords = coords;

    const cellElement = document.createElement('div');
    const numberElement = document.createElement('div');
    cellElement.id = id.toString();
    cellElement.classList.add('cell');
    numberElement.classList.add('number-container');

    if (value !== 0) {
      this.isDefault = true;
      cellElement.classList.add('cell-default');
      numberElement.textContent = value.toString();
    } else {
      const markersElement = document.createElement('div');
      markersElement.classList.add('marker-container');
      for (let i = 1; i < 10; i++) {
        const marker = document.createElement('span');
        marker.textContent = i.toString();
        marker.classList.add('marker');
        markersElement.appendChild(marker);
      }
      markersElement.addEventListener('click', (event: Event) =>
        this.handleMarkerClick(event),
      );

      cellElement.appendChild(markersElement);
    }

    // cellElement.appendChild(this.generateHelpers());
    cellElement.addEventListener('mouseenter', (event: Event) =>
      this.handleCellMouseOver(event),
    );
    cellElement.addEventListener('mouseleave', (event: Event) =>
      this.handleCellMouseOut(event),
    );

    cellElement.appendChild(numberElement);

    this.el = cellElement;
  }

  public getCell() {
    return this.el;
  }

  private generateHelpers() {
    const helperElement = document.createElement('span');
    helperElement.classList.add('helper');
    helperElement.textContent = `
    ${this.id.toString()} 
    [${this.coords.x},  ${this.coords.y}] 
    - ${this.currentValue.toString()}`;

    return helperElement;
  }

  private toggleMarker(value: SudokuNumber) {
    const currentIndexOfValue = this.markers.indexOf(value);
    if (currentIndexOfValue !== -1) {
      this.markers.splice(currentIndexOfValue, 1);
    } else {
      this.markers.push(value);
    }
  }

  private handleMarkerClick(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('marker-container')) return;
    const markerValue = Number(target.textContent);
    if (0 > markerValue || markerValue > 9) return;

    const cell = target.parentElement.parentElement;

    target.classList.toggle('selected');
    this.toggleMarker(markerValue);

    if (this.markers.length !== 1) {
      cell.classList.remove('has-one-marker');
      cell.querySelector('.number-container').textContent = '';
      this.currentValue = 0;
    } else {
      cell.classList.add('has-one-marker');
      cell.querySelector('.number-container').textContent =
        this.markers[0].toString();
      this.currentValue = this.markers[0];
    }

    this.emit('valueChanged', this.currentValue);
  }

  private handleCellMouseOver(e: Event) {
    const target = e.currentTarget as HTMLElement;
    target.classList.add('cell-hover');
  }
  private handleCellMouseOut(e: Event) {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('cell-hover');
  }

  setValue(value: SudokuNumber) {
    this.currentValue = value;
    this.el.querySelector('.number-container').classList.add('text-solution');
    this.el.querySelector('.number-container').textContent = value.toString();
  }

  showSolution(value: SudokuNumber) {
    const numberElementSolution = document.createElement('div');
    numberElementSolution.classList.add('number-container');
    numberElementSolution.classList.add('number-container--solution');
    this.currentValue = value;
    numberElementSolution.textContent = value.toString();
    this.el.appendChild(numberElementSolution);
  }

  setPossibilities(possibilities: Array<SudokuNumber>) {
    const possibilitiesDOm = document.createElement('div');
    possibilitiesDOm.classList.add('number-possibilities');
    possibilitiesDOm.textContent = possibilities.toString();
    this.el.querySelector('.number-container').appendChild(possibilitiesDOm);
  }
}
