<script setup lang="ts">
   import { DURATION } from '@/CONST';
   import { useRouter, useState } from '@/services/_index';
   import { wholeDivide } from '@/util';
   import { onMounted } from 'vue';

   /* 🔌 services */
   const { workouts, setWorkout } = useState();
   const { goTo } = useRouter();
   /* 🎈 defaults */
   const emit = defineEmits<{
      (event: 'setBackRoute', route: string | null): void;
      (event: 'hideBar'): void;
   }>();

   /* 📷 local state */

   /* 🔧 utility */
   const createWorkout = () => {
      setWorkout(-1);
      goTo('/workout-edit', 'New Workout');
      emit('hideBar');
   };

   const editWorkout = (i: number) => {
      setWorkout(i);
      goTo('/workout-edit', 'Edit Workout');
      emit('hideBar');
   };

   const parseSecs = (ms: number) => {
      let [h, rm] = wholeDivide(ms, DURATION['1h']);
      let [m, rs] = wholeDivide(rm, DURATION['1m']);
      let [s] = wholeDivide(rs, DURATION['1s']);

      let res: string[] = [];

      if (h) res.push(`${h}h`);
      if (res.length || m) res.push(`${m}m`);
      res.push(`${s}s`);

      return res.join(' ');
   };

   onMounted(() => emit('setBackRoute', '/home'));
</script>

<template>
   <div class="workouts">
      <div v-for="(workout, i) in workouts" class="workout-card">
         <div class="heading flex-center" @click="editWorkout(i)">
            <span class="name" v-text="workout.name" />
            <img class="icon play" src="icons/play.svg" />
         </div>
         <img class="icon menu" src="icons/menu.svg" />
         <div class="details flex-center">
            <div class="exercise flex-center">
               <img class="icon" src="icons/workout.svg" />
               <span v-text="workout.exercises.length" />
               <span v-text="'&nbsp;&nbsp;•&nbsp;&nbsp;'" />
               <img class="icon rep-icon" src="icons/reps.svg" />
               <span v-text="workout.reps" />
               <span v-text="'&nbsp;&nbsp;•&nbsp;&nbsp;'" />
               <span v-text="`${workout.exercises.length * workout.reps} total`" />
            </div>
            <div class="time flex-center">
               <img class="icon" src="icons/time.svg" />
               <span class="duration" v-text="parseSecs(workout.time)" />
            </div>
         </div>
      </div>
      <div class="add-btn flex-center" v-text="'+'" @click="createWorkout" />
   </div>
</template>

<style scoped>
   .workouts > * + * {
      margin-top: var(--s-sm);
      border-top: solid 1px var(--c-t-primary);
   }
   .workout-card {
      --s-heading: var(--s-xl3);
      padding: calc(var(--s-md)) var(--s-base);

      display: grid;
      align-items: center;
      justify-content: space-between;
      grid-template-columns: auto auto;
      grid-template-rows: var(--s-heading) auto;
      grid-template-areas: 'heading menu' 'details details';
   }

   .workout-card > * + * {
      margin-top: var(--s-md);
   }

   .workout-card .icon {
      filter: var(--f-primary);
   }

   .heading {
      grid-area: heading;
      justify-content: start;
   }

   .heading > * + * {
      margin-left: var(--s-base);
   }

   .heading .name {
      font-size: var(--s-xl2);
      font-weight: 500;
      text-decoration: underline;
      text-decoration-thickness: 3px;
      text-decoration-color: var(--c-accent);
   }

   .heading .play {
      --size: var(--s-xl2);
      height: var(--size);
      width: var(--size);
   }

   .menu {
      grid-area: menu;
      margin: 0;
      --size: var(--s-xl2);
      height: var(--size);
      width: var(--size);
      justify-self: end;
   }

   .details {
      --i-size: var(--s-lg3);
      font-size: var(--s-lg2);
      grid-area: details;
      justify-content: start;
      display: grid;
      align-items: center;
      justify-items: start;
      justify-content: start;
      grid-template-columns: auto auto;
      grid-template-rows: 1fr;
      grid-template-areas: 'stats' 'time';
   }

   .details .icon {
      width: var(--i-size);
      height: var(--i-size);
   }

   .time {
      grid-area: time;
   }

   .time .icon {
      margin-right: var(--s-sm);
   }

   .exercise {
      grid-area: stats;
   }

   .exercise .icon {
      --size: calc(var(--i-size) * 0.8);
      width: var(--size);
      height: var(--size);
   }

   .rep-icon {
      margin-right: var(--s-sm);
   }

   .workouts .add-btn {
      --rad: calc(var(--s-xl2) * 2);
      --separation: var(--s-base);
      border: 0;
      position: fixed;
      bottom: var(--separation);
      right: var(--separation);
      width: var(--rad);
      height: var(--rad);
      border-radius: 50%;
      background-color: var(--c-accent);
      font-size: var(--s-xl5);
      font-weight: 200;
      line-height: 0;
   }
</style>
