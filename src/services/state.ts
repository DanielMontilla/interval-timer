import { useStorage } from "@/services/_index";
import { Workout } from "@/types";
import { ref, watch } from "vue";

const workouts = ref<Workout[]>([]);

const init = () => {
   const { getWorkouts, setWorkouts } = useStorage();
   workouts.value = getWorkouts();
   watch(workouts, n => setWorkouts(n));
}


const useState = () => ({ init, workouts });

export default useState;