export const DIFFICULTY_EASY = 'easy'
export const DIFFICULTY_MEDIUM = 'medium'
export const DIFFICULTY_HARD = 'hard'
export const DIFFICULTY_EXPERT = 'expert'
export const DIFFICULTY_MASTER = 'master'

export type Difficulty =
  | typeof DIFFICULTY_EASY
  | typeof DIFFICULTY_MEDIUM
  | typeof DIFFICULTY_HARD
  | typeof DIFFICULTY_EXPERT
  | typeof DIFFICULTY_MASTER

export type Coords = {
  x: number
  y: number
}
