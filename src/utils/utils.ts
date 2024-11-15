import { Difficulty } from './types'

export function isDifficulty(value: string | null): value is Difficulty {
  return Object.values(Difficulty).includes(value as Difficulty)
}
