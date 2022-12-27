import { useRouter, useStorage } from "@/services/_index";
import { Workout, Workouts } from "@/types";
import { defineOptions } from "@/util";
import { v4 as genId } from 'uuid';
import { computed, ref, watch } from "vue";

const useState = () => ({ init, workouts, workout, addWorkout, selectWorkout, workoutsExists, removeWorkout });

const _workouts = ref<Workouts>({});
const _id = ref<string>('dc68a164-13d3-4ab3-adda-239dc3bd6473');
let _hasInit = false;

const workouts = computed(() => _workouts.value);

watch(_workouts, n => {
   if (!_hasInit) return;
   const { saveWorkouts } = useStorage();
   saveWorkouts(n);
}, { immediate: false, deep: true });

const selectWorkout = (id: string): boolean => {
   _id.value = id;
   return true;
}

const workout = computed<Workout | undefined>(() => {
   return _workouts.value[_id.value];
})

const workoutsExists = computed(() => Object.keys(_workouts.value).length > 0)

const addWorkout = (workout: Workout, options?: { select?: boolean, redirect?: boolean }) => {
   const { select, redirect } = defineOptions(options, { select: true, redirect: true });

   const id = genId();
   _workouts.value[id] = workout;

   if (select) selectWorkout(id);
   if (select && redirect) {
      const { goToNamed } = useRouter();
      goToNamed('workout')
   }
}

const removeWorkout = (id: string) => {
   delete _workouts.value[id]
}

const init = () => {
   const { fetchWorkouts } = useStorage();
   _workouts.value = fetchWorkouts();
   _hasInit = true;
}

export default useState;