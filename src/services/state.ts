import { useStorage } from "@/services/_index";
import { Workout } from "@/types";
import { computed, ref, watch } from "vue";

const workouts = ref<Workout[]>([]);
const _workoutIndex = ref<number>();

const workout = computed(() => {
   if (!_workoutIndex.value) return null;
   return workouts.value[_workoutIndex.value];
})

const init = () => {
   const { getWorkouts, setWorkouts } = useStorage();
   workouts.value = getWorkouts();
   watch(workouts, n => setWorkouts(n));
}


const useState = () => ({ init, workouts, workout });

export default useState;