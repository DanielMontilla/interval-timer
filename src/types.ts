import { defineComponent } from 'vue';

export type vueComponent = ReturnType<typeof defineComponent>;

export interface Exercise {
   name: string;
   secs: number;
}
export interface Workout {
   name: string;
   reps: number;
   time: number;
   exercises: Exercise[];
}

export type InputState = 'unfilled' | 'error' | 'completed';
