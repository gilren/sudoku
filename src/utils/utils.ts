import { Difficulty } from './types'

export function isDifficulty(value: string | null): value is Difficulty {
  return Object.values(Difficulty).includes(value as Difficulty)
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

export function isAllowedKey(
  value: string,
): value is '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' {
  return Number(value) >= 0 && Number(value) <= 9
}
