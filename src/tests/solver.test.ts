import { describe, expect, it, test } from 'vitest'
import { solveBoard } from '@/lib/solver'
import type { Board } from '@/types'

describe('solver', () => {
  test('Solver should reject 0 filled sudoku', () => {
    const raw = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const solution = solveBoard(raw as Board)

    expect(solution).toEqual(null)
  })

  test('Solver should reject non valid numbers sudoku', () => {
    const raw = [
      [0, 0, 0, null, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 59, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, '#', 0, 0, 0, 0],
      [0, undefined, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, false, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 'd', 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    const solution = solveBoard(raw as Board)

    expect(solution).toEqual(null)
  })

  test('Solver should reject less than 17 values sudoku', () => {
    const raw = [
      [0, 3, 0, 0, 4, 0, 0, 0, 5],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [6, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [7, 4, 0, 0, 1, 0, 0, 9, 0],
    ]

    const solution = solveBoard(raw as Board)

    expect(solution).toEqual(null)
  })
})


import easyBoards from '../../sudokus/easy.json'

describe('easy puzzles', () => {
  it.each(easyBoards.map((board, i) => [i, board]))(
    '[EASY] Puzzle %i has a unique solution',
    (_, board) => {
      const solution = solveBoard(board as Board)
      expect(solution).not.toBeNull()
    }
  )
})

import mediumBoards from '../../sudokus/medium.json'

describe('medium puzzles', () => {
  it.each(mediumBoards.map((board, i) => [i, board]))(
    '[MEDIUM] Puzzle %i has a unique solution',
    (_, board) => {
      const solution = solveBoard(board as Board)
      expect(solution).not.toBeNull()
    }
  )
})
