export function isSudokuCell(
  value: number,
): value is 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 {
  return value >= 0 && value <= 9;
}
