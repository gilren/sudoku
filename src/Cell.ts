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
    console.log(value);
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

    this.setValue(value, markers);
  }

  setValue(value: number, markers: Array<number>, undo: boolean = false) {
    const info = {
      id: this.id,
      oldValue: this.currentValue,
      newValue: value,
      oldMarkers: this.markers,
      newMarkers: markers,
    };

    this.currentValue = value;
    this.markers = markers;

    if (this.markers.length !== 1) {
      this.currentValue = 0;
    }

    if (!undo) {
      this.emit('valueChanged', info);
    } else {
      this.emit('markersChanged');
    }
  }

  // updateValue(value: number, markers: Array<number>) {
  //   this.currentValue = value;
  //   this.markers = markers;
  //   if (this.markers.length !== 1) {
  //     this.currentValue = 0;
  //   }

  //   this.emit('markersChanged', markers);
  // }
}
