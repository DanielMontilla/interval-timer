import { Workout } from '@/types';
import { addProp } from '@/util';
import { useStorage, useRouter } from '@/services/_index';
import { ref, watch } from 'vue';
import { computed } from '@vue/reactivity';
type W = Workout[];

const { load, save, exists } = useStorage();
const { goTo } = useRouter();

const key = 'workouts';

const workouts = ref(exists(key) ? (load<W>(key) as W) : save<W>('workouts', []));
const currentWorkoutIndex = ref(workouts.value.length ? 0 : -1);

const currentWorkout = computed(() => workouts.value[currentWorkoutIndex.value]);

const open = (index: number) => {
   currentWorkoutIndex.value = index;
   goTo('/workout');
};

const add = ({ exercises, name, reps }: Omit<Workout, 'time'>) => {
   let time = 0;

   for (const exercise of exercises) {
      time += exercise.secs;
   }

   time *= reps;

   workouts.value.push({
      name: name,
      reps: reps,
      exercises: exercises,
      time: time,
   });
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

const useWorkout = () => ({ currentWorkout, workouts, add, clear, open });

export default useWorkout;
