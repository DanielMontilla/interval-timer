import { Exercise, Workout } from "@/types";

const useStorage = () => ({ fetchWorkouts, uploadWorkouts, uploadWorkout, reset });

const WORKOUTS_KEY = 'workouts' as const;
const { stringify, parse } = JSON;

const _storage = localStorage; // can't destructure localStore due to 'invalid invocation'
const _getItem = (key: string) => _storage.getItem(key);
const _setItem = (key: string, value: string) => _storage.setItem(key, value);
const _clear = () => _storage.clear();
const _isWorkouts = (obj: any): obj is Workout[] => obj; // this is pretty fickle. on real app should use a more robust parser

const reset = (): Workout[] => {
   let _: Workout[] = [];
   _clear();
   uploadWorkouts(_);
   return _;
}

const fetchWorkouts = (): Workout[] => {
   let value = _getItem(WORKOUTS_KEY);
   let myWorkouts: Workout[];
   if (!value) {
      myWorkouts = reset();
   } else {
      let o: any;
      try { o = parse(value) } catch { o = null }; // incase the string is formated incorrectly
      myWorkouts = _isWorkouts(o) ? o : reset();
   }
   return myWorkouts;
}

const uploadWorkouts = (workouts: Workout[]) => _setItem(WORKOUTS_KEY, stringify(workouts));

const uploadWorkout = (workout: Workout) => {
   console.log('updated');
   let workouts = fetchWorkouts();
   workouts.push(workout);
   uploadWorkouts(workouts);
}

export default useStorage;