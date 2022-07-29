<script setup lang="ts">
   import { useState } from '@/services/_index';
   import {
      Exercise,
      InputData,
      InputState,
      InputValidation,
      SetBackRoute,
      Workout,
   } from '@/types';
   import { onMounted, ref } from 'vue';
   import { Input } from '@/components/_index';
   import { delay, isNumeric } from '@/util';

   /* 🔌 services */
   const { getWorkout, workoutIndex, addWorkout, modifyWorkout } = useState();

   /* 🎈 defaults */
   const workout = getWorkout();
   const emit = defineEmits<{
      (event: 'setBackRoute', route: string | null): void;
   }>();

   /* 📷 local state */
   const name = ref<InputData<string>>({
      value: workout ? workout.name : null,
      state: workout ? 'completed' : 'unfilled',
   });

   const reps = ref<InputData<number>>({
      value: workout ? workout.reps : null,
      state: workout ? 'completed' : 'unfilled',
   });

   const exercises = ref<{ name: InputData<string>; duration: InputData<number> }[]>(
      workout
         ? workout.exercises.map(w => ({
              name: {
                 value: w.name,
                 state: 'completed',
              },
              duration: {
                 value: w.secs,
                 state: 'completed',
              },
           }))
         : [
              {
                 name: { value: null, state: 'unfilled' },
                 duration: { value: null, state: 'unfilled' },
              },
           ]
   );

   const saving = ref(false);

   /* 🔧 utility */
   const animAction = async (e: MouseEvent, result: boolean) => {
      let el = e.target as HTMLDivElement;
      let anim = 'pulsate';

      if (el.classList.contains('icon')) el = el.parentElement as HTMLDivElement;
      if (!result) anim = 'shake';

      el.addEventListener(
         'animationend',
         () => {
            el.classList.remove(anim);
         },
         { once: true }
      );

      el.classList.add(anim);
   };

   const getNthExercise = (n: number) => {};

   /* 📅 event handlers */
   const addExercise = (at: number) => {
      let exercise: { name: InputData<string>; duration: InputData<number> } = {
         name: { value: null, state: 'unfilled' },
         duration: { value: null, state: 'unfilled' },
      };

      exercises.value.splice(at, 0, exercise);

      getNthExercise(at);
      // mainEl.value.scrollBy(0, 100);

      return true;
   };

   const deleteExercise = (i: number) => {
      if (exercises.value.length > 1) {
         exercises.value.splice(i, 1)[0];
         return true;
      }

      return false;
   };

   const moveExercise = (i: number, direction: 'up' | 'down') => {
      if (direction === 'down' && !exercises.value[i + 1]) return false;
      if (direction === 'up' && !exercises.value[i - 1]) return false;

      let exercise = exercises.value.splice(i, 1)[0];
      exercises.value.splice(direction === 'down' ? i + 1 : i - 1, 0, exercise);

      return true;
   };

   const duplicateExercise = (i: number) => {
      let { name, duration } = exercises.value[i];
      exercises.value.splice(i + 1, 0, { name, duration });
      return true;
   };

   const save = async () => {
      saving.value = true;

      await delay(500);
      let canSave = true;

      const check = (data: InputData<string | number>) => {
         if (data.state !== 'completed') {
            canSave = false;
            if (data.state === 'unfilled') data.state = 'error';
         }
      };

      check(name.value);
      check(reps.value);
      exercises.value.forEach(e => {
         check(e.name);
         check(e.duration);
      });

      saving.value = false;

      if (canSave) {
         let n = name.value.value as string;
         let r = reps.value.value as number;
         let e: Exercise[] = exercises.value.map(e => ({
            name: e.name.value as string,
            secs: e.duration.value as number,
         }));

         let w: Workout = { name: n, reps: r, exercises: e, time: 9999 };

         if (workoutIndex.value === -1) {
            // its new
            addWorkout(w);
         } else {
            // its old
            modifyWorkout(workoutIndex.value, w);
         }
      }
   };

   /* 🔎 validation */
   const validateName: InputValidation = (value: string) => {
      let state: InputState;

      if (value === '') {
         state = 'unfilled';
      } else if (value.length > 15) {
         state = 'error';
      } else {
         state = 'completed';
      }

      return {
         state,
      };
   };
   const validateExerciseName: InputValidation = (value: string) => {
      let state: InputState;

      if (value === '') {
         state = 'unfilled';
      } else if (value.length > 12) {
         state = 'error';
      } else {
         state = 'completed';
      }

      return {
         state,
      };
   };

   const preventChars = (value: string) => !isNumeric(value);
   const validateReps: InputValidation = (value: string) => {
      let state: InputState;

      if (value === '') {
         state = 'unfilled';
      } else if (!isNumeric(value) || Number.parseInt(value) < 1) {
         state = 'error';
      } else {
         state = 'completed';
      }

      return {
         state,
      };
   };

   onMounted(() => emit('setBackRoute', '/workouts'));
</script>

<template>
   <div class="workout-edit">
      <div class="general">
         <!-- <div class="section-title" v-text="'General'" /> -->
         <Input
            class="input name"
            v-model:data="name"
            :validate="validateName"
            placeholder="workout name"
            label="name"
         />
         <Input
            class="input reps"
            v-model:data="reps"
            :validate="validateReps"
            :prevent="preventChars"
            placeholder="reps"
            label="reps"
         />
      </div>
      <div class="exercises">
         <!-- <div class="section-title" v-text="'Exercises'" /> -->
         <div v-for="(exercise, i) in exercises" class="exercise-card">
            <div class="exercise-label">
               <span v-text="'Exercise #'" />
               <span v-text="i + 1" class="italic" />
            </div>
            <Input
               class="input exercise-name"
               v-model:data="exercise.name"
               :validate="validateExerciseName"
               placeholder="exercise name"
               label="exercise"
            />
            <Input
               class="input exercise-duration"
               v-model:data="exercise.duration"
               :validate="validateReps"
               :prevent="preventChars"
               placeholder="exercise duration (s)"
               label="exercise"
            />
            <div class="actions">
               <div class="normal">
                  <div
                     class="icon-wrapper"
                     @click="animAction($event, addExercise(i + 1))"
                  >
                     <img class="icon add" src="icons/x.svg" />
                  </div>
                  <div
                     class="icon-wrapper"
                     @click="animAction($event, duplicateExercise(i))"
                  >
                     <img class="icon duplicate" src="icons/duplicate.svg" />
                  </div>
                  <div
                     class="icon-wrapper"
                     @click="animAction($event, moveExercise(i, 'up'))"
                  >
                     <img class="icon up" src="icons/up-arrow.svg" />
                  </div>
                  <div
                     class="icon-wrapper"
                     @click="animAction($event, moveExercise(i, 'down'))"
                  >
                     <img class="icon down" src="icons/up-arrow.svg" />
                  </div>
               </div>
               <div class="danger">
                  <div
                     class="icon-wrapper delete"
                     @click="animAction($event, deleteExercise(i))"
                  >
                     <img class="icon" src="icons/x.svg" />
                  </div>
               </div>
            </div>
         </div>
      </div>
      <div class="options">
         <div
            class="finish"
            v-text="'save'"
            @click="!saving ? [animAction($event, true), save()] : null"
         />
         <img v-if="saving" class="icon spin" src="icons/load.svg" />
         <div class="status" />
      </div>
   </div>
</template>

<style scoped>
   .workout-edit {
      padding: var(--s-md);
   }

   .general .input {
      font-size: var(--s-xl2);
   }
   .exercises .input {
      font-size: var(--s-xl);
   }

   .general .name {
      margin: 0;
   }

   .section-title {
      width: 100%;
      font-size: var(--s-xl4);
      text-align: center;
      font-weight: bold;
   }

   .exercises {
      margin-top: var(--s-lg);
   }

   .exercises > .exercise-card + .exercise-card {
      --space: var(--s-lg2);
      margin-top: var(--space);
      padding-top: var(--space);
      border-top: 2px solid var(--c-fg);
   }

   .general > * + * {
      margin-top: var(--s-base);
   }

   .exercise-card > * + * {
      margin-top: var(--s-base);
   }

   .actions {
      width: 100%;
      display: flex;
      align-items: center;
      --size: var(--s-xl3);
   }

   .actions .icon-wrapper {
      height: 100%;
      background-color: var(--c-fg);
      display: flex;
      justify-content: center;
      align-items: center;
      height: var(--size);
      width: var(--size);
      border-radius: var(--s-sm);
   }

   .actions .normal {
      width: min-content;
      display: flex;
      align-items: center;
   }

   .actions .danger {
      width: 100%;
      display: flex;
      justify-content: end;
   }

   .icon {
      filter: var(--f-primary);
   }

   .icon-wrapper .icon {
      height: 65%;
   }

   .delete {
      justify-self: end;
   }
   .delete .icon {
      filter: var(--f-red);
   }

   .actions .normal > * + * {
      margin-left: var(--s-md);
   }

   .down {
      transform: rotate(180deg);
   }

   .add {
      transform: rotate(45deg);
   }

   .exercise-card .exercise-label {
      font-size: var(--s-lg3);
      line-height: 1;
      margin-bottom: var(--s-sx);
   }
   .exercise-card .exercise-name {
      margin-top: var(--s-sxx);
   }

   .options {
      width: 100%;
      height: var(--s-xl5);
      margin-top: var(--s-xl2);
      display: flex;
      align-items: center;
   }

   .options .icon {
      height: 70%;
      margin-left: var(--s-base);
   }

   .finish {
      font-size: var(--s-xl2);
      font-weight: bold;
      background-color: var(--c-fg);
      line-height: 1;
      padding: var(--s-sm) var(--s-md);
      border-radius: var(--s-sm);
      justify-self: start;
   }

   .italic {
      font-style: italic;
   }
</style>
