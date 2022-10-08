import { Exercise, InputValidator } from "@/types";

/* validators! */
export const notEmpty: InputValidator = (n: string) => ({
  isValid: n.trim().length > 0,
  msg: `can't be empty`
})

export const lessThan = (i: number, withWhiteSpace = false): InputValidator => (n: string) => ({
  isValid: withWhiteSpace ? n.length < i : n.trim().length < i,
  msg: `must be less than ${i} characters`
})

export const moreThan = (i: number, withWhiteSpace = false): InputValidator => (n: string) => ({
  isValid: withWhiteSpace ? n.length > i : n.trim().length > i,
  msg: `must be more than ${i} characters`
})

export const moreThanNumeric = (i: number): InputValidator => (n: string) => ({
  isValid: Number(n) > i,
  msg: `must be more than ${i}`
})

export const lessThanNumeric = (i: number): InputValidator => (n: string) => ({
  isValid: Number(n) < i,
  msg: `must be less than ${i}`
})

export const isInt: InputValidator = (n: string) => ({
  isValid: Number.isInteger(Number(n)),
  msg: `must be integer`
})

// TODO: FIX
export const isNumber: InputValidator = (n: string) => ({
  isValid: !Number.isNaN(Number(n)),
  msg: `must be a number`
})

/* shared contants */
export const ACTIONS = ['add', 'copy', 'moveup', 'movedown', 'delete'] as const;
export const getDefExercise = (): Exercise => ({ name: {}, duration: {} });