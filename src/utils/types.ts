export enum Difficulty {
	EASY = "easy",
	MEDIUM = "medium",
	HARD = "hard",
	EXPERT = "expert",
	MASTER = "master",
}

export type Status = "init" | "loading" | "failure" | "playing" | "solved"

export type Coords = {
	x: number
	y: number
}

export type UndoAction = {
	x: number
	y: number
	previousValue: number
	newValue: number
	previousMarkers?: Set<number>
	newMarkers?: Set<number>
}

export type Duplicate = {
	value: number
	id: number
}
