import { Exercise, InputEl, InputElRef, InputValidator } from "@/types";
import { VNodeRef } from "vue";

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

export const isInputEl = (el: any): el is InputEl => el.validate != undefined;

/* actual util */
export const clamp = (n: number, {min, max} = { min: 0, max: 1 }) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}