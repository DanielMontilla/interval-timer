import { ACTIONS_ARRAY } from "@/util";
import { Input } from "@/components/_index";
import { Ref } from "vue";

export type Action = typeof ACTIONS_ARRAY[number];

export interface Exercise {
  name: string
  duration: number
};

export type InputState = 'empty' | 'valid' | 'invalid';
export interface InputData {
  content: string,
  state: InputState,
  msg?: string
}

export interface ExerciseData {
  name: InputData,
  duration: InputData
}

export interface Workout {
  name: string,
  reps: number,
  exercises: Exercise[];
};

export type Workouts = Record<string, Workout>;

export type LoopCallback = (dt: number) => void;

export interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
  miliseconds: number;
}