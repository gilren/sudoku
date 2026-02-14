export const DIFFICULTIES = ['easy', 'medium', 'hard', 'expert', 'master'] as const
type DifficultyTuple = typeof DIFFICULTIES
export type Difficulty = DifficultyTuple[number]

export type Status = 'init' | 'loading' | 'failure' | 'playing' | 'solved'

export type Coords = {
  x: number
  y: number
}

export type UndoAction = {
  x: number
  y: number
  previousValue: number
  newValue: number
  previousMarkers?: Set<number>
  newMarkers?: Set<number>
}

export type Duplicate = {
  value: number
  id: number
}

type Row = [number, number, number, number, number, number, number, number, number]
export type Board = [Row, Row, Row, Row, Row, Row, Row, Row, Row]
export type CellMarkers = Set<number> | null
type MarkersRow = [
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
  CellMarkers,
]
export type MarkersBoard = [
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
  MarkersRow,
]

// export type CellValue = null | Range<1, 9>
// export type MarkerValue = Range<1, 9>

// type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N
//   ? R
//   : Tuple<T, N, [...R, T]>

// type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
//   ? Acc[number]
//   : Enumerate<N, [...Acc, Acc['length']]>

// export type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>> | T

// export type Row<T> = Tuple<T, 9>
// export type Grid<T> = Tuple<Row<T>, 9>
// export type GridMarkers<T> = Tuple<Set<T>, 9>
