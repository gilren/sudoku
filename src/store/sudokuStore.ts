import { DIFFICULTY_EASY, type Difficulty } from '@/utils/types'
import { isDifficulty } from '@/utils/utils'
import { computed, reactive, type ComputedRef } from 'vue'

interface GameState {
  board: number[][]
  difficulty: Difficulty
  loading: boolean
}

export function useSudokuStore() {
  const state = reactive<GameState>({
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    difficulty: initDifficulty(),
    loading: false,
  })

  function initDifficulty(): Difficulty {
    const storedDifficulty = localStorage.getItem('difficulty')
    return isDifficulty(storedDifficulty) ? storedDifficulty : DIFFICULTY_EASY
  }

  function setDifficulty(difficulty: Difficulty) {
    if (isDifficulty(difficulty)) {
      state.difficulty = difficulty
      localStorage.setItem('difficulty', difficulty)
    } else {
      throw new Error('Trying to assign non valid difficulty')
    }
  }

  const getDifficulty: ComputedRef<Difficulty> = computed(() => state.difficulty)

  async function loadBoard() {
    try {
      state.loading = true
      console.log('loading board')
      const difficulty = getDifficulty.value
      const data = (await import(`../../sudokus/${difficulty}.json`)).default[0]
      state.board.splice(0, state.board.length, ...data)
      state.loading = false
    } catch (e) {
      console.error('Failed to load board:', e)
      throw e
    }
  }

  const getBoard: ComputedRef<number[][]> = computed(() => state.board)

  return {
    state,
    setDifficulty,
    getDifficulty,
    loadBoard,
    getBoard,
  }
}
