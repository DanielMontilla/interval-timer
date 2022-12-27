import { Exercise, Workout, Workouts } from "@/types";
import { parseWorkouts } from "@/validation";

const useStorage = () => ({ saveWorkouts, fetchWorkouts });
const WORKOUTS_KEY = 'workouts' as const;

const saveWorkouts = (workouts: Workouts) => {
  const result = parseWorkouts(workouts);
  if (!result.success) {
    // if workouts is incorrect
    console.error(`something went wrong saving!`);
    result.error.errors.forEach(({ message }) => console.error(message));
    return;
  }
  const { data } = result;
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(data));
}
const initWorkouts = () => saveWorkouts({});
const resetWorkouts = initWorkouts;

const fetchWorkouts = (): Workouts => {
  let content = localStorage.getItem(WORKOUTS_KEY);

  if (!content) {
    // If no workotus are saved!
    initWorkouts();
    return fetchWorkouts();
  };

  const rawData = JSON.parse(content);
  const result = parseWorkouts(rawData);

  if (!result.success) {
    // if data is corrupted (incorrect/failed validation)
    console.error(`corrupted workouts, clearing...`);
    resetWorkouts()
    return fetchWorkouts();
  }

  return result.data;
}

export default useStorage;