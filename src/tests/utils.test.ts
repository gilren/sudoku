import { expect, test, describe } from 'vitest'
import { Difficulty } from '@/utils/types'
import { isDifficulty, isAllowedKey } from '@/utils/utils'

describe('isDifficulty', () => {
  test('is not a valid difficulty', () => {
    expect(isDifficulty('test')).toEqual(false)
  })
  test('is a valid difficulty', () => {
    expect(isDifficulty('easy')).toEqual(true)
  })
})

describe('isAllowedKey', () => {
  test('is not a valid key', () => {
    expect(isAllowedKey('#')).toEqual(false)
  })
  test('is not a valid key', () => {
    expect(isAllowedKey(5)).toEqual(false)
  })
  test('is not a valid key', () => {
    expect(isAllowedKey('-5')).toEqual(false)
  })
  test('is a valid key', () => {
    expect(isAllowedKey('5')).toEqual(true)
  })
})
