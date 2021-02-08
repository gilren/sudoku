import Observer from './Observer';

export default class Cell {
  private observer: Observer;

  markers: Array<Number> = [];

  el: HTMLDivElement;
  currentValue: Number = 0;

  constructor(value: Number) {
    const cellElement = document.createElement('div');
    const numberElement = document.createElement('div');
    cellElement.classList.add('cell');
    numberElement.classList.add('number-container');
    numberElement.textContent = '';

    if (value !== 0) {
      cellElement.classList.add('cell-default');
      numberElement.textContent = value.toString();
    } else {
      const markerElement = this.generateMarkers();

      cellElement.appendChild(markerElement);
    }
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

  private generateMarkers() {
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

    return markersElement;
  }

  private toggleMarker(value: number) {
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
      cell.querySelector(
        '.number-container',
      ).textContent = this.markers[0].toString();
      this.currentValue = this.markers[0];
    }

    if (this.observer != null) {
      this.observer.currentValue(this.currentValue);
    }

    // cell.classList.add
  }

  private handleCellMouseOver(e: Event) {
    const cell = e.target as HTMLElement;
    cell.classList.add('cell-hover');
  }
  private handleCellMouseOut(e: Event) {
    const cell = e.target as HTMLElement;
    cell.classList.remove('cell-hover');
  }

  public attach(observer: Observer) {
    this.observer = observer;
  }
}
