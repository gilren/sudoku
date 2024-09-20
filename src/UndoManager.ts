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
    console.log('Stored action', action);
  }

  undo(): Action | undefined {
    if (this.stack.length === 0) {
      return undefined;
    }
    console.log('stack before pop', this.stack);
    const test = this.stack.pop();
    console.log('stack after pop', this.stack);
    return test;
  }

  clear() {
    this.stack = [];
  }
}
