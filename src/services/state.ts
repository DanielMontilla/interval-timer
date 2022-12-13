import { useRouter, useStorage } from "@/services/_index";
import { Workout } from "@/types";
import { defineOptions } from "@/util";
import { computed, ref, watch } from "vue";

const useState = () => ({ init, workouts, workout, addWorkout, selectWorkout });

const _workouts = ref<Workout[]>([]);
const _workoutIndex = ref<number>(0);
let _hasInit = false;

const workouts = computed(() => _workouts.value);

watch(_workouts, n => {
   if (!_hasInit) return;
   const { uploadWorkouts } = useStorage();
   uploadWorkouts(n);
}, { immediate: false, deep: true });

const selectWorkout = (i: number): boolean => {
   if (i < 0 || i >= workouts.value.length) return false;
   _workoutIndex.value = i;
   return true;
}

const workout = computed(() => {
   if (_workoutIndex.value == null) return null;
   return _workouts.value[_workoutIndex.value];
})

const addWorkout = (workout: Workout, options?: { select?: boolean, redirect?: boolean }) => {
   const { select, redirect } = defineOptions(options, { select: true, redirect: true });

   const i = _workouts.value.push(workout) - 1;

   if (select) selectWorkout(i);
   if (select && redirect) {
      const { goToNamed } = useRouter();
      goToNamed('workout')
   }
}

const init = () => {
   const { fetchWorkouts } = useStorage();
   _workouts.value = fetchWorkouts();
   _hasInit = true;
}

export default useState;