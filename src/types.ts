import { ACTIONS } from "@/util";

export type InputState = 'invalid' | 'valid'
export type InputType = string | number;
export interface InputData<T extends InputType> {
  content?: T,
  state?: InputState
}
export type InputValidator = (n: string) => { isValid: boolean, msg: string }
export type Action = typeof ACTIONS[number];

export interface Exercise {
  name: InputData<string>,
  duration: InputData<number>
};

export type Workout = Exercise[];