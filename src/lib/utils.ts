import { DIFFICULTIES, type Difficulty } from '@/types'

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty)
}

export function timeToText(elapsedTime: number): string {
  const seconds = Math.floor((elapsedTime / 1000) % 60)
  const minutes = Math.floor((elapsedTime / (1000 * 60)) % 60)
  const hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24)

  let text = ''
  if (hours > 0) text += `${hours}H `
  if (minutes > 0) text += `${minutes}M `
  text += `${seconds}S`
  return text
}

export function isAllowedKeyNumber(value: string): Boolean {
  if (typeof value !== 'string') return false
  return Number(value) >= 1 && Number(value) <= 9
}
