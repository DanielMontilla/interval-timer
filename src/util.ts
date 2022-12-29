import { Exercise, ExerciseData, InputData, InputState } from "@/types";
import { VNodeRef } from "vue";
import { ZodSchema } from "zod";


/* shared contants */
export const ACTIONS_ARRAY = ['add', 'copy', 'moveup', 'movedown', 'delete'] as const;
export const DEF_INPUT_DATA: InputData = { state: 'empty', content: '' };
export const DEF_EXERCISE_DATA: ExerciseData = { name: DEF_INPUT_DATA, duration: DEF_INPUT_DATA };

export const KEY_SFX_ARR = Array(3).map(i => `succ_click_${i}`);

/* actual util */
export const clamp = (n: number, {min, max} = { min: 0, max: 1 }) => {
  if (n < min) return min;
  if (n > max) return max;
  return n;
}

type IsWithInOptions = { inclusive: boolean, min: number, max: number }
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


type MapToOptions = { from: Interval, to: Interval }
export const mapTo = (value: number, options?: Partial<MapToOptions>) => {
  const { from: { min: fmin, max: fmax }, to: { min: tmin, max: tmax } } = defineOptions(options, { 
    from: { min: 0, max: 1 },
    to: { min: 0, max: 2 }
  })

  return tmin + (((value - fmin)*(tmax - tmin)) / (fmax - fmin));
}

export const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
export const waitMs = wait;
export const waitS = (secs: number) => wait(secs * 1000);

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

type Interval = { min: number, max: number }
export const randFloat = (opts: Partial<Interval>) => {
  const { min, max } = defineOptions(opts, { min: 0, max: 1 });
  return Math.random() * (max - min) + min;
}
export const randInt = (opts: Partial<Interval>) => Math.round(randFloat(opts));
export const randPick = <T>(arr: T[]): T => arr[ randInt({ min: 0, max: arr.length - 1 }) ];

export const divide = (divisor: number, dividend: number) => {
  const quotient = divisor % dividend;
  const remainder = dividend - divisor * quotient;
  return { quotient, remainder };
}
export const toSignificant = (n: number, digits: number) => {
  digits = Math.round(digits);
  let res = `${n}`;
  if (res.length < digits) res += Array(digits - res.length).fill(`0`).join();
  return res.substring(0, digits);
}
const aSecond = 1000;
const aMinute = aSecond * 60;
const anHour = aMinute * 60;
export const parseDuration = (ms: number) => {
  const { quotient: hours, remainder: rHours } = divide(ms, anHour);
  const { quotient: minutes, remainder: rMinutes } = divide(ms, rHours);
  const { quotient: seconds, remainder: miliseconds } = divide(ms, rMinutes);
  const hasHours = hours > 0;
  const hasMinutes = minutes > 0 && hasHours;
  const hasSeconds = seconds > 0 && hasMinutes;
  return {
    hours: hasHours ? toSignificant(hours, 2) : null,
    minutes: hasMinutes ? toSignificant(minutes, 2) : null,
    seconds: hasSeconds ? toSignificant(seconds, 2) : null,
    miliseconds: toSignificant(miliseconds, 2)
  }
}