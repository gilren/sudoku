import EventEmitter from './EventEmitter';
import { Coords } from './types';
import { isSudokuCell } from './utils';

export default class Cell extends EventEmitter {
  id: number;
  isDefault: boolean;
  currentValue: number;
  coords: Coords;
  markers: Array<number>;

  el: HTMLDivElement;
  numberEl: HTMLDivElement;
  markersEl: HTMLDivElement | null;
  constructor(value: number, id: number, coords: Coords) {
    super();

    this.id = id;
    this.isDefault = false;
    this.currentValue = value;
    this.coords = coords;
    this.markers = [];

    this.el = document.createElement('div');
    this.numberEl = document.createElement('div');
    this.markersEl = null;

    this.el.id = id.toString();
    this.el.classList.add('cell');
    this.numberEl.classList.add('number-container');

    if (value !== 0) {
      this.isDefault = true;
      this.el.classList.add('cell-default');
      this.numberEl.textContent = value.toString();
    } else {
      this.markersEl = document.createElement('div');
      this.markersEl.classList.add('marker-container');
      for (let i = 1; i < 10; i++) {
        const marker = document.createElement('span');
        marker.textContent = i.toString();
        marker.classList.add('marker');
        this.markersEl.appendChild(marker);
      }
      this.markersEl.addEventListener('click', (event: MouseEvent) =>
        this.handleMarkerClick(event),
      );

      this.el.appendChild(this.markersEl);
    }

    this.el.appendChild(this.generateHelpers());
    this.el.addEventListener('mouseenter', (event: MouseEvent) =>
      this.handleCellMouseOver(event),
    );
    this.el.addEventListener('mouseleave', (event: MouseEvent) =>
      this.handleCellMouseOut(event),
    );

    this.el.appendChild(this.numberEl);
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

  private toggleMarker(value: number) {
    const currentIndexOfValue = this.markers.indexOf(value);
    if (currentIndexOfValue !== -1) {
      this.markers.splice(currentIndexOfValue, 1);
    } else {
      this.markers.push(value);
    }
  }

  private handleMarkerClick(e: MouseEvent) {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains('marker-container')) return;

    const markerValue = Number(target.textContent);

    if (!isSudokuCell(markerValue)) {
      console.error('Value not allowed');
      return;
    }

    target.classList.toggle('selected');

    this.toggleMarker(markerValue);

    if (this.markers.length !== 1) {
      this.el.classList.remove('has-one-marker');
      this.numberEl.textContent = '';
      this.currentValue = 0;
    } else {
      this.el.classList.add('has-one-marker');
      this.numberEl.textContent = this.markers[0].toString();
      this.currentValue = this.markers[0];
    }

    this.emit('valueChanged', this.currentValue);
  }

  private handleCellMouseOver(e: MouseEvent) {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.add('cell-hover');
    }
  }
  private handleCellMouseOut(e: MouseEvent) {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.classList.remove('cell-hover');
    }
  }

  setValue(value: number) {
    this.currentValue = value;
    this.numberEl.classList.add('text-solution');
    this.numberEl.textContent = value.toString();
  }

  showSolution(value: number) {
    const solutionEl = document.createElement('div');
    solutionEl.classList.add('number-container');
    solutionEl.classList.add('number-container--solution');
    this.currentValue = value;
    solutionEl.textContent = value.toString();
    this.el.appendChild(solutionEl);
  }
}
