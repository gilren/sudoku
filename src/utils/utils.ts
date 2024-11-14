import {
  DIFFICULTY_EASY,
  DIFFICULTY_EXPERT,
  DIFFICULTY_HARD,
  DIFFICULTY_MASTER,
  DIFFICULTY_MEDIUM,
} from '@/utils/types'

export function isDifficulty(
  value: string,
): value is
  | typeof DIFFICULTY_EASY
  | typeof DIFFICULTY_MEDIUM
  | typeof DIFFICULTY_HARD
  | typeof DIFFICULTY_EXPERT
  | typeof DIFFICULTY_MASTER {
  return (
    value === DIFFICULTY_EASY ||
    value === DIFFICULTY_MEDIUM ||
    value === DIFFICULTY_HARD ||
    value === DIFFICULTY_EXPERT ||
    value === DIFFICULTY_MASTER
  )
}
