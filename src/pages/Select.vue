<script setup lang="ts">
   import { useWorkout, useRouter } from '@/services/_index';
   import { parseSecs } from '@/util';
   import { Exercise } from '@/types';
   import { Separator } from '@/components/_index';

   const { workouts, clear } = useWorkout();
   const { goTo } = useRouter();

   const parseExercises = (exercises: Exercise[]) => {
      let res = '';
      for (const exercise of exercises) {
         res += `${exercise.name} ${exercise.secs}s ➤ `;
      }

      res = res.slice(0, res.length - ' ➤ '.length);
      return res;
   };
   const add = () => goTo('/new-workout');
</script>

<template>
   <div class="select-workout page">
      <Separator text="My Workouts" size="var(--xl2)" />
      <div class="workout-list">
         <div v-for="workout in workouts" class="workout-card d-grid">
            <div class="name">{{ workout.name }}</div>
            <img class="menu" src="@/assets/icons/menu.svg" />
            <div class="details">
               <div class="detail d-flex">
                  <img class="detail-icon" src="@/assets/icons/time.svg" />
                  {{ parseSecs(workout.time) }}
               </div>
               <div :style="{ margin: '0 var(--md)' }">|</div>
               <div class="detail d-flex">
                  <img class="detail-icon" src="@/assets/icons/workout.svg" />
                  {{ workout.exercises.length }}
               </div>
            </div>
            <div class="exercises">
               {{ parseExercises(workout.exercises) }}
            </div>
         </div>
      </div>
      <button @click="clear" :style="{ marginTop: '40px' }">clear</button>
      <div class="add d-flex" @click="add">
         <img src="@/assets/icons/add.svg" />
      </div>
   </div>
</template>

<style scoped>
   .workout-list > * + * {
      margin-top: var(--sm);
      border-top: solid var(--sxx) hsla(var(--highlight-dark), 0.1);
   }

   .workout-card {
      grid-template-columns: 3fr 1fr;
      grid-template-rows: min-content min-content min-content;
      grid-template-areas:
         'name menu'
         'details details'
         'exercises exercises';
      padding: 0 var(--sm);
   }

   .name {
      grid-area: name;
      font-size: var(--lg3);
      text-decoration: underline solid hsla(var(--accent1-dark), 0.6) 4px;
      font-weight: bold;
      justify-self: start;
   }

   .menu {
      grid-area: menu;
      filter: var(--f-white);
      justify-self: end;
      height: var(--lg3);
      width: var(--lg3);
   }

   .details {
      font-size: var(--lg2);
      grid-area: details;
      justify-self: start;
      display: flex;
      align-items: center;
      justify-content: start;
   }

   .detail > * + * {
      margin-left: var(--sm);
   }

   .detail-icon {
      filter: var(--f-white);
      --size: var(--lg2);
      height: var(--size);
      width: var(--size);
   }

   .exercises {
      grid-area: exercises;
      font-size: var(--lg);
      justify-self: start;
      width: 100%;
      color: hsla(var(--txt-dark), 0.55);
      white-space: nowrap;
      overflow-x: hidden;
   }

   .add {
      position: absolute;
      bottom: var(--base);
      right: var(--base);

      --radius: var(--xl2);

      height: calc(var(--radius) * 2);
      width: calc(var(--radius) * 2);

      border-radius: var(--radius);
      background-color: hsla(var(--primary-dark), 1);
   }

   .add img {
      --size: 40%;
      filter: var(--f-white);
      height: var(--size);
      width: var(--size);
   }
</style>
