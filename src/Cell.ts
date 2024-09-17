import EventEmitter from './EventEmitter';
import { SudokuNumber } from './types';

interface CoordsType {
  x: number;
  y: number;
}

export default class Cell extends EventEmitter {
  el: HTMLDivElement;
  numberElement: HTMLDivElement;
  markersElement: HTMLDivElement | null = null;

  markers: Array<SudokuNumber> = [];
  currentValue: SudokuNumber = 0;
  id: number;
  coords: CoordsType;
  isDefault: boolean = false;

  constructor(value: SudokuNumber, id: number, coords: CoordsType) {
    super();
    this.id = id;
    this.currentValue = value;

    this.coords = coords;

    this.el = document.createElement('div');
    this.numberElement = document.createElement('div');

    this.el.id = id.toString();
    this.el.classList.add('cell');
    this.numberElement.classList.add('number-container');

    if (value !== 0) {
      this.isDefault = true;
      this.el.classList.add('cell-default');
      this.numberElement.textContent = value.toString();
    } else {
      this.markersElement = document.createElement('div');
      this.markersElement.classList.add('marker-container');
      for (let i = 1; i < 10; i++) {
        const marker = document.createElement('span');
        marker.textContent = i.toString();
        marker.classList.add('marker');
        this.markersElement.appendChild(marker);
      }
      this.markersElement.addEventListener('click', (event: Event) =>
        this.handleMarkerClick(event),
      );

      this.el.appendChild(this.markersElement);
    }

    this.el.appendChild(this.generateHelpers());
    this.el.addEventListener('mouseenter', (event: Event) =>
      this.handleCellMouseOver(event),
    );
    this.el.addEventListener('mouseleave', (event: Event) =>
      this.handleCellMouseOut(event),
    );

    this.el.appendChild(this.numberElement);
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
    `;
    // - ${this.currentValue.toString()}

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
    if (1 > markerValue || markerValue > 9) return;

    target.classList.toggle('selected');
    this.toggleMarker(markerValue as SudokuNumber);

    if (this.markers.length !== 1) {
      this.el.classList.remove('has-one-marker');
      this.numberElement.textContent = '';
      this.currentValue = 0;
    } else {
      this.el.classList.add('has-one-marker');
      this.numberElement.textContent = this.markers[0].toString();
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
    this.numberElement.classList.add('text-solution');
    this.numberElement.textContent = value.toString();
  }

  showSolution(value: SudokuNumber) {
    const numberElementSolution = document.createElement('div');
    numberElementSolution.classList.add('number-container');
    numberElementSolution.classList.add('number-container--solution');
    this.currentValue = value;
    numberElementSolution.textContent = value.toString();
    this.el.appendChild(numberElementSolution);
  }
}
