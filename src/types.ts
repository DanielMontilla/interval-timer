import { defineComponent } from 'vue';

export type vueComponent = ReturnType<typeof defineComponent>;

export interface Exercise {
   name: string;
   secs: number;
   icon?: 'rest' | 'run';
}

export interface Workout {
   name: string;
   reps: number;
   time: number;
   exercises: Exercise[];
}

export type LoopCallback = (dt: number) => any;

export interface IntervalOptions {
   time: number;
   onTick?: (dt: number) => void;
   onIteration?: (iteration: number) => number | void | 'completed';
   onCompleted?: () => number | void;
   iterations?: number | 'infinite';
   paused?: boolean;
}

export type InputState = 'unfilled' | 'error' | 'completed';
