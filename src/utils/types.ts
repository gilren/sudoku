export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
  MASTER = 'master',
}
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
