import { Workout } from '@/types';
import { addProp } from '@/util';
import { useStorage } from '@/services/_index';
import { ref, watch } from 'vue';

const { load, save, exists } = useStorage();

const key = 'workouts';
type W = Workout[];

const workouts = ref(exists(key) ? (load<W>(key) as W) : save<W>('workouts', []));
const currentWorkout = ref(workouts.value.length ? 0 : -1);

const add = (workout: Omit<Workout, 'time'>) => {
   let time = 0;
   for (const exercise of workout.exercises) {
      time += exercise.secs;
   }

   time *= workout.reps;

   workouts.value.push(addProp(workout, 'time', time));
};

const clear = () => {
   workouts.value.splice(0);
};

watch(
   workouts,
   n => {
      save(key, n);
   },
   { deep: true }
);

const useWorkout = () => ({ currentWorkout, workouts, add, clear });

export default useWorkout;
