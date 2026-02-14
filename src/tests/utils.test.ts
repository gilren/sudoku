import { describe, expect, test } from 'vitest'
import { isAllowedKeyNumber, isDifficulty } from '@/lib/utils'

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
    expect(isAllowedKeyNumber('#')).toEqual(false)
  })
  test('is not a valid key', () => {
    expect(isAllowedKeyNumber('-5')).toEqual(false)
  })
  test('is a valid key', () => {
    expect(isAllowedKeyNumber('5')).toEqual(true)
  })
})
