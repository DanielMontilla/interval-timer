<script setup lang="ts">
   import { FormField } from '@/components/_index';
   import { useRouter, useWorkout } from '@/services/_index';
   import { Exercise, InputState } from '@/types';
   import { computed, onMounted, ref, watch } from 'vue';
   import Separator from '@/components/Separator.vue';

   const { goTo } = useRouter();
   const { add } = useWorkout();

   const name = ref<[string, InputState]>(['', 'unfilled']);
   const reps = ref<[string, InputState]>(['', 'unfilled']);
   const exercises = ref<
      {
         name: [string, InputState];
         secs: [string, InputState];
      }[]
   >([]);

   const time = computed<string>(() => {
      let totalSecs = 0;
      for (let i = 0; i < exercises.value.length; i++) {
         if (!Number.isNaN(Number.parseInt(exercises.value[i].secs[0])))
            totalSecs += Number.parseInt(exercises.value[i].secs[0]);
      }

      if (!Number.isNaN(Number.parseInt(reps.value[0]))) {
         totalSecs *= Number.parseInt(reps.value[0]);
      } else {
         totalSecs = 0;
      }

      // TODO: use util func for this

      let mins: number;
      let secs: number;

      if (totalSecs >= 60) {
         mins = Math.floor(totalSecs / 60);
         secs = totalSecs - mins * 60;
      } else {
         mins = 0;
         secs = totalSecs;
      }

      let secsStr = `${secs}`;

      if (secsStr.length == 1) secsStr = '0' + secsStr;

      return `${mins}:${secsStr}`;
   });

   const addExercise = () => {
      exercises.value.push({
         name: ['', 'unfilled'],
         secs: ['', 'unfilled'],
      });
   };

   // Input fields validation !
   const nameValid = (n: string): InputState => {
      if (n === '' || n.length > 16) {
         return 'error';
      } else {
         return 'completed';
      }
   };
   const repsValid = (r: string): InputState => {
      if (r) {
         let n = Number.parseFloat(r);
         if (Number.isNaN(n) || n < 1 || n % 1 !== 0) {
            return 'error';
         } else {
            return 'completed';
         }
      }
      return 'error';
   };

   const exerciseNameValid = (n: string) => {
      if (n === '' || n.length > 16) {
         return 'error';
      } else {
         return 'completed';
      }
   };

   const move = (i: number, dir: 'prev' | 'next') => {
      let j = dir === 'prev' ? i - 1 : i + 1;
      if (j < 0 || j > exercises.value.length - 1) return;

      let [ei, ej] = [exercises.value[i], exercises.value[j]];

      exercises.value[i] = ej;
      exercises.value[j] = ei;
   };

   const submit = async () => {
      // Validating everything
      const isValid = (): boolean => {
         if (name.value[1] != 'completed') return false;
         if (reps.value[1] != 'completed') return false;

         for (let i = 0; i < exercises.value.length; i++) {
            if (exercises.value[i].name[1] != 'completed') return false;
            if (exercises.value[i].secs[1] != 'completed') return false;
         }

         return true;
      };

      if (isValid()) {
         let exercisesArr: Exercise[] = [];

         for (let i = 0; i < exercises.value.length; i++) {
            exercisesArr.push({
               name: exercises.value[i].name[0],
               secs: Number.parseInt(exercises.value[i].secs[0]),
            });
         }

         add({
            name: name.value[0],
            reps: Number.parseInt(reps.value[0]),
            exercises: exercisesArr,
         });

         goTo('/select');
      } else {
         if (name.value[1] != 'completed') name.value[1] = 'error';
         if (reps.value[1] != 'completed') reps.value[1] = 'error';
         for (let i = 0; i < exercises.value.length; i++) {
            if (exercises.value[i].name[1] != 'completed')
               exercises.value[i].name[1] = 'error';
            if (exercises.value[i].secs[1] != 'completed')
               exercises.value[i].secs[1] = 'error';
         }
      }
   };

   onMounted(() => {
      addExercise();
   });
</script>

<template>
   <div class="create-workout page max-width">
      <div class="form d-flex">
         <Separator text="General" />
         <div class="general-form">
            <FormField
               name="name"
               class="form-field"
               v-model:content="name"
               type="string"
               :focus="true"
               :validation="nameValid"
            />
            <FormField
               name="reps"
               class="form-field"
               v-model:content="reps"
               type="number"
               :validation="repsValid"
            />
            <div class="workout-stats d-grid">
               <div class="time-stat workout-stat d-flex">
                  <img class="stat-icon" src="/icons/time.svg" />
                  <div class="stat-text">
                     {{ time }}
                  </div>
               </div>
               <div class="count-stat workout-stat d-flex">
                  <img class="stat-icon" src="/icons/workout.svg" />
                  {{ exercises.length }}
               </div>
            </div>
         </div>
         <Separator text="Exercises" />
         <div class="exercises d-flex">
            <div v-for="(exercise, i) in exercises" class="exercise-card">
               <FormField
                  name="exersice name"
                  v-model:content="exercise.name"
                  type="string"
                  :validation="exerciseNameValid"
               />
               <FormField
                  name="seconds"
                  v-model:content="exercise.secs"
                  type="number"
                  :validation="repsValid"
               />
               <div class="position-btns d-flex">
                  <img
                     class="prev pos-btn"
                     src="/icons/up-arrow.svg"
                     @click="move(i, 'prev')"
                  />
                  <img
                     class="next pos-btn"
                     src="/icons/up-arrow.svg"
                     :style="{ transform: 'rotate(180deg)' }"
                     @click="move(i, 'next')"
                  />
               </div>
            </div>
            <div class="add-exercise-btn d-flex" @click="addExercise">
               <img src="/icons/plus.svg" />
            </div>
         </div>
         <div class="actions-area d-grid">
            <div class="cancel-btn action-btn d-flex" @click="goTo('/select')">
               <img class="cancel-icon action-icon" src="/icons/x.svg" />
            </div>
            <div class="submit-btn action-btn d-flex" @click="submit">
               <img class="submit-icon action-icon" src="/icons/check.svg" />
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .form {
      grid-area: form;

      flex-direction: column;
   }

   .form-field {
      width: 100%;
      font-size: var(--xl2);
   }

   .general-form {
      padding: var(--sm);
   }
   .general-form > * + * {
      margin-top: var(--md);
   }

   .exercises {
      width: 100%;
      flex-direction: column;
   }
   .exercises > * + * {
      margin-top: var(--md);
   }

   .exercise-card {
      width: 100%;
      font-size: var(--xl);
      padding: var(--md);
      border: var(--sxx) solid hsla(var(--highlight-dark), 0.1);
      border-radius: var(--md);
   }
   .exercise-card > * + * {
      margin-top: var(--md);
   }

   .add-exercise-btn {
      width: 100%;
      height: var(--xl5);
      background-color: hsla(var(--secundary-dark), 0.7);

      border-radius: var(--md);
   }

   .add-exercise-btn img {
      filter: var(--f-white);
      height: 80%;
      font-size: var(--xl);
   }

   .position-btns {
      height: var(--xl);
   }
   .position-btns {
      height: var(--xl2);
   }
   .position-btns > * + * {
      margin-left: var(--xl3);
   }

   .pos-btn {
      filter: var(--f-white);
      height: 100%;
   }

   .actions-area {
      margin-top: var(--md);
      height: var(--xl5);
      width: 100%;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'cancel submit';
      gap: var(--md);
   }

   .action-btn {
      width: 100%;
      height: 100%;
      border-radius: var(--md);
   }

   .cancel-btn {
      grid-area: cancel;
      background-color: hsla(var(--error-dark), 1);
   }
   .submit-btn {
      grid-area: submit;
      background-color: hsla(var(--succ-dark), 1);
   }

   .action-icon {
      height: var(--xl);
      filter: var(--f-white);
   }

   .workout-stats {
      font-size: var(--xl);
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      grid-template-areas: 'time count';
   }

   .time-stat {
      grid-area: time;
   }
   .count-stat {
      grid-area: count;
   }

   .workout-stat {
      min-width: var(--xl5);
   }

   .stat-icon {
      filter: var(--f-white);
      margin-right: var(--md);
      --size: var(--xl);
      height: var(--size);
      width: var(--size);
   }
</style>
