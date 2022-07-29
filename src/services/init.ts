import { WorkoutEdit, Workouts, Home, Workout } from '@/pages/_index';
import { useRouter, useState, useStorage } from '@/services/_index';
import { Workouts as W } from '@/types';
import { ref } from 'vue';

const initializing = ref(true);

const init = async () => {
   const { initRoutes } = useRouter();
   const { load, save, exists } = useStorage();
   const { workouts, clearWorkouts, setWorkouts } = useState();

   await initRoutes(
      {
         '/home': { component: Home, defTitle: 'Home' },
         '/workouts': { component: Workouts, defTitle: 'Workouts' },
         '/workout-edit': { component: WorkoutEdit, defTitle: 'Edit Workout' },
         '/workout': { component: Workout, defTitle: 'Workout' },
      },
      { route: '/workouts' }
   );

   const key = 'workouts';
   clearWorkouts();
   setWorkouts(exists(key) ? (load<W>(key) as W) : save<W>('workouts', []));

   initializing.value = false;
};

const useInit = () => ({ initializing, init });

export default useInit;
