import {
  DIFFICULTY_EASY,
  DIFFICULTY_HARD,
  DIFFICULTY_MEDIUM,
  DIFFICULTY_EXPERT,
  DIFFICULTY_MASTER,
} from './constants';

export type Difficulty =
  | typeof DIFFICULTY_EASY
  | typeof DIFFICULTY_MEDIUM
  | typeof DIFFICULTY_HARD
  | typeof DIFFICULTY_EXPERT
  | typeof DIFFICULTY_MASTER;

export type Board = Array<Array<number>> | null;

export type Coords = {
  x: number;
  y: number;
};
