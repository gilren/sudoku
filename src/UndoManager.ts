import { Action } from './types';

export default class UndoManager {
  stack: Array<Action>;
  maxSize: number;
  constructor() {
    this.stack = [];
    this.maxSize = 80;
  }

  store(action: Action) {
    if (this.stack.length === this.maxSize) {
      this.stack.shift();
    }
    this.stack.push(action);
  }

  undo(): Action | undefined {
    if (this.stack.length === 0) {
      return undefined;
    }

    return this.stack.pop();
  }

  clear() {
    this.stack = [];
  }
}
