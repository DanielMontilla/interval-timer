import { defineComponent } from 'vue';

export type vueComponent = ReturnType<typeof defineComponent>;

export interface Workout {
   name: string;
   reps: number;
   time: number;
   exercises: { name: string; secs: number }[];
}
