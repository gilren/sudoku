export default class Soduku {
  wrapperEl: HTMLElement;
  private Originalmap: Array<Array<Number>>;
  private map: Array<Array<Number>>;

  constructor(wrapperEl: HTMLElement) {
    console.log('Sudoku');
    this.wrapperEl = wrapperEl;
    this.Originalmap = [
      [0, 0, 0, 0, 0, 0, 6, 0, 9],
      [0, 3, 4, 8, 0, 9, 0, 0, 0],
      [2, 0, 1, 0, 0, 0, 0, 7, 0],
      [0, 5, 6, 0, 8, 0, 0, 0, 2],
      [0, 8, 0, 5, 1, 2, 0, 4, 0],
      [7, 0, 0, 0, 9, 0, 3, 5, 0],
      [0, 2, 0, 0, 0, 0, 4, 0, 1],
      [0, 0, 0, 1, 0, 5, 9, 6, 0],
      [1, 0, 9, 0, 0, 0, 0, 0, 0],
    ];

    this.display();
  }

  display() {
    let fragment = new DocumentFragment();
    for (const row of this.Originalmap) {
      for (const cell of row) {
        const cellElement = document.createElement('div');
        const numberElement = document.createElement('div');
        cellElement.classList.add('cell');
        numberElement.classList.add('number-container');
        numberElement.textContent = '';

        if (cell !== 0) {
          cellElement.classList.add('cell-default');
          numberElement.textContent = cell.toString();
        } else {
          const markerElement = this.generateMarkers();
          cellElement.appendChild(markerElement);
        }
        cellElement.appendChild(numberElement);
        fragment.appendChild(cellElement);
      }
    }
    this.wrapperEl.classList.add('sudoku-grid');
    this.wrapperEl.appendChild(fragment);
  }

  generateMarkers() {
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

  handleMarkerClick(e: Event) {
    const marker = e.target as HTMLHtmlElement;
    if (marker.classList.contains('marker-container')) return;
    marker.classList.toggle('selected');

    const cell = marker.parentElement.parentElement;
    cell.querySelector('.number-container').textContent = marker.textContent;
    // cell.classList.add
  }
}
