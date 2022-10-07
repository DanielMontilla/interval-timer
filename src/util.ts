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

export const isNumber: InputValidator = (n: string) => ({
  isValid: Number(n) != Number.NaN,
  msg: `must be a number`
})

/* shared contants */
export const ACTIONS = ['add', 'copy', 'moveup', 'movedown', 'delete'] as const;
export const DEF_EXERCISE: Exercise = { name: {content: ''}, duration: {content: 5} };