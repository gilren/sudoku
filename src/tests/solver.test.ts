import { describe, expect, test } from "vitest"
import { solveBoard } from "@/Solver"

describe("solver", () => {
	test("Solver can solve an easy sudoku", () => {
		const raw = [
			[0, 9, 0, 8, 6, 5, 2, 0, 0],
			[0, 0, 5, 0, 1, 2, 0, 6, 8],
			[0, 0, 0, 0, 0, 0, 0, 4, 0],
			[0, 0, 0, 0, 0, 8, 0, 5, 6],
			[0, 0, 8, 0, 0, 0, 4, 0, 0],
			[4, 5, 0, 9, 0, 0, 0, 0, 0],
			[0, 8, 0, 0, 0, 0, 0, 0, 0],
			[2, 4, 0, 1, 7, 0, 5, 0, 0],
			[0, 0, 7, 2, 8, 3, 0, 9, 0],
		]

		const solved = [
			[1, 9, 4, 8, 6, 5, 2, 3, 7],
			[7, 3, 5, 4, 1, 2, 9, 6, 8],
			[8, 6, 2, 3, 9, 7, 1, 4, 5],
			[9, 2, 1, 7, 4, 8, 3, 5, 6],
			[6, 7, 8, 5, 3, 1, 4, 2, 9],
			[4, 5, 3, 9, 2, 6, 8, 7, 1],
			[3, 8, 9, 6, 5, 4, 7, 1, 2],
			[2, 4, 6, 1, 7, 9, 5, 8, 3],
			[5, 1, 7, 2, 8, 3, 6, 9, 4],
		]

		const solution = solveBoard(raw)

		expect(solution).toEqual(solved)
	})

	test("Solver should reject empty sudoku", () => {
		const raw = [[]]

		const solution = solveBoard(raw)

		expect(solution).toEqual(null)
	})

	test("Solver should reject 0 filled sudoku", () => {
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

		const solution = solveBoard(raw)

		expect(solution).toEqual(null)
	})

	test("Solver should reject non valid numbers sudoku", () => {
		const raw = [
			[0, 0, 0, null, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 59, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, "#", 0, 0, 0, 0],
			[0, undefined, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, false, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, "d", 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
		]

		const solution = solveBoard(raw as number[][])

		expect(solution).toEqual(null)
	})

	test("Solver should reject less than 17 values sudoku", () => {
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

		const solution = solveBoard(raw)

		expect(solution).toEqual(null)
	})
})
