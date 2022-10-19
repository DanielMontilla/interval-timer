import { ACTIONS } from "@/util";
import { Input } from "@/components/_index";
import { Ref } from "vue";

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

export type InputEl = InstanceType<typeof Input>
export type InputElRef = Ref<InputEl | null>

export type LoopCallback = (dt: number) => void;