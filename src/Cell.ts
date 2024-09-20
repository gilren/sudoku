import EventEmitter from './EventEmitter';
import { Coords } from './types';
import { isSudokuCell } from './utils';

export default class Cell extends EventEmitter {
  id: number;
  currentValue: number;
  markers: Array<number>;
  coords: Coords;
  isDefault: boolean;

  constructor(value: number, id: number, coords: Coords) {
    super();
    this.id = id;
    this.currentValue = value;
    this.coords = coords;
    this.markers = [];
    this.isDefault = value !== 0;
  }

  handleClick(e: MouseEvent) {
    const target = e.target;
    if (!(target instanceof HTMLSpanElement)) return;

    const value = Number(target.textContent);

    if (!isSudokuCell(value)) {
      console.error('Value not allowed');
      return;
    }

    const markers = [...this.markers];
    const valueIndex = markers.indexOf(value);
    if (valueIndex !== -1) {
      markers.splice(valueIndex, 1);
    } else {
      markers.push(value);
    }

    this.setValue(markers);
  }

  setValue(markers: Array<number>, undo: boolean = false) {
    const oldvalue = this.currentValue;
    const oldMarkers = this.markers;
    this.markers = markers;

    if (this.markers.length !== 1) {
      this.currentValue = 0;
    } else {
      this.currentValue = this.markers[0];
    }

    const info = {
      id: this.id,
      oldValue: oldvalue,
      newValue: this.currentValue,
      oldMarkers: oldMarkers,
      newMarkers: this.markers,
    };

    if (!undo) {
      this.emit('saveAction', info);
    }
    this.emit('valueChanged', info);
  }
}
