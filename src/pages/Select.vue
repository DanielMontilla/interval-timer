<script setup lang="ts">
   import { useWorkout, useRouter } from '@/services/_index';

   const { workouts } = useWorkout();
   const { goTo } = useRouter();

   const add = () => goTo('/new-workout');
</script>

<template>
   <div class="workout-list">
      <div v-for="workout in workouts" class="workout-item">
         {{ workout.name }}
      </div>
   </div>
   <div class="add" @click="add">
      <img src="@/assets/icons/add.svg" />
   </div>
</template>

<style>
   .add {
      position: absolute;
      bottom: var(--base);
      right: var(--base);

      --radius: 32px;

      height: calc(var(--radius) * 2);
      width: calc(var(--radius) * 2);

      border-radius: var(--radius);
      background-color: hsla(var(--primary-dark), 1);

      /* Flex 💪 */
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .add img {
      --size: 40%;
      filter: var(--f-white);
      height: var(--size);
      width: var(--size);
   }
</style>
