<script setup lang="ts">
   import { useWorkout, useRouter } from '@/services/_index';
   import { parseSecs } from '@/util';
   import { Exercise, Workout } from '@/types';
   import { Separator, Menu } from '@/components/_index';
   import { ref } from 'vue';
   import { Duplex } from 'stream';

   const { workouts, open } = useWorkout();
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

   const showMenu = ref(false);
   const selectedWorkout = ref(0);
   const menuOptions = [
      {
         label: 'edit',
         iconSrc: 'edit',
         callback: () => {},
      },
      {
         label: 'duplicate',
         iconSrc: 'duplicate',
         callback: () => {
            let { exercises, name, reps, time } = workouts.value[selectedWorkout.value];

            let dupe: Workout = {
               name: name + ' copy',
               exercises: exercises,
               reps: reps,
               time: time,
            };

            workouts.value.splice(selectedWorkout.value + 1, 0, dupe);
         },
      },
      {
         label: 'delete',
         iconSrc: 'x',
         callback: () => {
            workouts.value.splice(selectedWorkout.value, 1);
         },
         color: 'red',
      },
   ];
   const spawnMenu = (i: number) => {
      selectedWorkout.value = i;
      showMenu.value = true;
   };
</script>

<template>
   <div class="select-workout page">
      <!-- TODO: find way for component to handle its own animation transitions -->
      <Transition name="fade">
         <Menu v-if="showMenu" :options="menuOptions" :close="() => (showMenu = false)" />
      </Transition>
      <Separator text="My Workouts" size="var(--xl2)" class="fixed" />
      <div class="workout-list">
         <div v-for="(workout, i) in workouts" class="workout-card d-grid">
            <div class="name-plate d-flex" @click="open(i)">
               <div class="name">{{ workout.name }}</div>
               <img class="name-icon" src="/icons/play.svg" />
            </div>
            <img class="menu" src="/icons/menu.svg" @click="spawnMenu(i)" />
            <div class="details">
               <div class="detail d-flex">
                  <img class="detail-icon" src="/icons/time.svg" />
                  <span>
                     {{ parseSecs(workout.time) }}
                  </span>
               </div>
               <div :style="{ margin: '0 var(--md)' }">|</div>
               <div class="detail d-flex">
                  <img class="detail-icon" src="/icons/workout.svg" />
                  <span>
                     {{ workout.exercises.length }}
                  </span>
               </div>
            </div>
            <div class="exercises">
               {{ parseExercises(workout.exercises) }}
            </div>
         </div>
      </div>
      <div class="add d-flex" @click="add">
         <img src="/icons/add.svg" />
      </div>
   </div>
</template>

<style scoped>
   .select-workout {
      height: 100vh;
   }
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

   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.25s ease;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }

   .name-plate {
      grid-area: name;
      justify-self: start;
   }
   .name-plate > * + * {
      margin-left: var(--md);
   }

   .name {
      font-size: var(--lg3);
      text-decoration: underline solid hsla(var(--accent1-dark), 0.6) 4px;
      font-weight: bold;
   }

   .name-icon {
      filter: var(--f-white);
      --size: var(--lg3);

      width: var(--size);
      height: var(--size);
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
