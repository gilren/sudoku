import './style.css';

import Sudoku from './Sudoku';

const element = document.getElementById('app');

if (element) {
  const sudokuDiv = element as HTMLElement;
  new Sudoku(sudokuDiv);
} else {
  console.error('Element with id app not found');
}
