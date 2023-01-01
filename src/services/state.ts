import { useRouter, useStorage } from "@/services/_index";
import { Workout, Workouts } from "@/types";
import { defineOptions } from "@/util";
import { v4 as genId } from 'uuid';
import { computed, ref, watch } from "vue";

const useState = () => ({ init, firstLoad, workouts, workout, addWorkout, selectWorkout, workoutsExists, removeWorkout, editWorkout, editing, stopEditing, selectEditWorkout, showNav });

const _workouts = ref<Workouts>({});
const _id = ref<string>('');
const _editingId = ref<string>('');
let _hasInit = false;

const showNav = ref(false);
const firstLoad = ref(true);

const workouts = computed(() => _workouts.value);
const editing = ref<{
   workout: Workout,
   id: string
}>();

const selectEditWorkout = (id: string) => {
   _editingId.value = id;

   if (!_workouts.value[id]) return;
   if (id == _id.value) selectWorkout('');

   const { goToNamed } = useRouter();
   goToNamed('create');
}

const stopEditing = () => selectEditWorkout('');

const editWorkout = (id: string, workout: Workout, finish = true) => {
   if (!_workouts.value[id]) return;
   _workouts.value[id] = workout;
   if (finish) {
      stopEditing();
      selectWorkout(id);
   };
}

watch(_editingId, (n, o) => {
   if (n === o) return;
   !_workouts.value[n] 
      ? editing.value = undefined
      : editing.value = { workout: _workouts.value[n], id: n};
})

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
   if (id === _editingId.value) {
      selectEditWorkout('');
   }
   delete _workouts.value[id]
}

const init = () => {
   const { fetchWorkouts } = useStorage();
   _workouts.value = fetchWorkouts();
   _hasInit = true;
}

export default useState;