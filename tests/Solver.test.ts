import Solver from '../src/Solver';

test('Solver can solve an easy sudoku', () => {
  const raw = [
    [0, 9, 0, 8, 6, 5, 2, 0, 0],
    [0, 0, 5, 0, 1, 2, 0, 6, 8],
    [0, 0, 0, 0, 0, 0, 0, 4, 0],
    [0, 0, 0, 0, 0, 8, 0, 5, 6],
    [0, 0, 8, 0, 0, 0, 4, 0, 0],
    [4, 5, 0, 9, 0, 0, 0, 0, 0],
    [0, 8, 0, 0, 0, 0, 0, 0, 0],
    [2, 4, 0, 1, 7, 0, 5, 0, 0],
    [0, 0, 7, 2, 8, 3, 0, 9, 0],
  ];

  const solved = [
    [1, 9, 4, 8, 6, 5, 2, 3, 7],
    [7, 3, 5, 4, 1, 2, 9, 6, 8],
    [8, 6, 2, 3, 9, 7, 1, 4, 5],
    [9, 2, 1, 7, 4, 8, 3, 5, 6],
    [6, 7, 8, 5, 3, 1, 4, 2, 9],
    [4, 5, 3, 9, 2, 6, 8, 7, 1],
    [3, 8, 9, 6, 5, 4, 7, 1, 2],
    [2, 4, 6, 1, 7, 9, 5, 8, 3],
    [5, 1, 7, 2, 8, 3, 6, 9, 4],
  ];

  const solver = new Solver(raw);
  solver.solve();
  const solution = solver.solution;

  expect(solution).toEqual(solved);
});

test('Solver should reject empty sudoku', () => {
  const raw = [[]];

  const solver = new Solver(raw);
  solver.solve();
  const solution = solver.solution;

  expect(solution).toEqual(null);
});

test('Solver should reject 0 filled sudoku', () => {
  const raw = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const solver = new Solver(raw);
  solver.solve();
  const solution = solver.solution;

  expect(solution).toEqual(null);
});

test('Solver should reject less than 17 values sudoku', () => {
  const raw = [
    [0, 3, 0, 0, 4, 0, 0, 0, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, 4, 0, 0, 1, 0, 0, 9, 0],
  ];

  const solver = new Solver(raw);
  solver.solve();
  const solution = solver.solution;

  expect(solution).toEqual(null);
});
