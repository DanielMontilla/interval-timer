import { Exercise, InputEl, InputElRef, InputExercise, InputValidator } from "@/types";
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
export const getDefExercise = (): InputExercise => ({ name: {}, duration: {} });

export const isInputEl = (el: any): el is InputEl => el.validate != undefined;

/* actual util */
export const clamp = (n: number, {min, max} = { min: 0, max: 1 }) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const waitMs = wait;
export const waitS = (secs: number) => wait(secs * 1000);

// TODO: copy from vue-idle
// export const randPick = <T>(arr: T[]): T => {
  
// }

/**
 * @description used to construct complete config objects from incomplete/missing config.
 * @param config partial or missing config
 * @param def values to set for missing config properties
 * @returns complete config object
 */
 export const defineOptions = <T extends Object> (
  config: Partial<T> | undefined,
  def: T
): T => {

  if (!config) return def;
  
  let res: T = {...config} as T;

  for (const key in def) {
    if (Object.prototype.hasOwnProperty.call(def, key)) {
      const objectKey = key as keyof T;
      if (!(objectKey in config)) res[objectKey] = def[key];
    }
  }

  return res;
}