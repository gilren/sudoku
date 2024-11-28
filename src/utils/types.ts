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

export function isAllowedKey(
  value: string,
): value is '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' {
  return Number(value) >= 0 && Number(value) <= 9
}
