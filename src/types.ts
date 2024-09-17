export type SudokuNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type CanPlaceResult =
  | { result: 'valid' }
  | { result: 'duplicate'; row: number; col: number };
