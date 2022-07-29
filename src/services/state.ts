import { Workout, Workouts } from '@/types';
import { Ref, ref, toRaw } from 'vue';
import { useStorage } from '@/services/_index';

/* 🎯 general app state */
const pageTitle = ref('');
const mainEl = ref<HTMLElement>() as Ref<HTMLElement>;

/** @description keep track of current app theme */
const theme = ref<'dark' | 'light'>('dark');
const toggleTheme = () => (theme.value = theme.value === 'dark' ? 'light' : 'dark');

/* 💪 workout state */
/** @description all stored workouts */
const workouts = ref<Workouts>([]);
/** @description currently selected workout index */
const workoutIndex = ref<number>(-1);

const saveWorkouts = () => {
   const { save } = useStorage();
   const key = 'workouts';

   save(key, workouts.value);
};

const getWorkout = (): Workout | undefined => workouts.value[workoutIndex.value];

const clearWorkouts = () => workouts.value.splice(0, workouts.value.length);
const setWorkouts = (arr: Workouts) => arr.forEach(w => workouts.value.push(w));

const deleteWorkout = (i: number) => workouts.value.splice(i, 0);
const addWorkout = (w: Workout) => {
   workouts.value.push(w);
   saveWorkouts();
};
const moveWorkout = (i: number, direction: 'up' | 'down') => {};
const copyWorkout = (i: number) => {};
const modifyWorkout = (i: number, w: Workout) => {
   workouts.value.splice(i, 1, w);
   saveWorkouts();
};

const setWorkout = (i: number | -1) => (workoutIndex.value = i);

const useState = () => ({
   theme,
   toggleTheme,
   workouts,
   workoutIndex,
   clearWorkouts,
   setWorkouts,
   deleteWorkout,
   addWorkout,
   moveWorkout,
   setWorkout,
   getWorkout,
   pageTitle,
   mainEl,
   modifyWorkout,
});

export default useState;
