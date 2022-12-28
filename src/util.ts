import { Exercise, ExerciseData, InputData, InputState } from "@/types";
import { VNodeRef } from "vue";
import { ZodSchema } from "zod";


/* shared contants */
export const ACTIONS_ARRAY = ['add', 'copy', 'moveup', 'movedown', 'delete'] as const;
export const DEF_INPUT_DATA: InputData = { state: 'empty', content: '' };
export const DEF_EXERCISE_DATA: ExerciseData = { name: DEF_INPUT_DATA, duration: DEF_INPUT_DATA };


/* actual util */
export const clamp = (n: number, {min, max} = { min: 0, max: 1 }) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

type IsWithInOptions = { inclusive: boolean, min: number, max: number}
export const isWithIn = (n: number, options?: Partial<IsWithInOptions>): boolean => {
  const { inclusive, min, max } = defineOptions(options, {
    inclusive: true,
    min: 0,
    max: 1
  })

  return inclusive
    ? n >= min && n <= max
    : n > min && n < max
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

/* Validation stuff */
export const validateInputData = (content: string, schema: ZodSchema, isNumber: boolean = false): InputData => {
  
  const refinedContent = isNumber ? Number.parseFloat(content) : content.trim();
  let state: InputState = 'empty'
  let msg: string | undefined = undefined;

  let result = schema.safeParse(refinedContent);

  if (!result.success) {
    state = 'invalid';
    msg = result.error.issues[0].message;
  } else {
    state = 'valid';
    msg = undefined;
  }

  return { content, state, msg }
}