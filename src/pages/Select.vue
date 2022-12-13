<script setup lang="ts">
  import { useState, useRouter } from '@/services/_index';

  const { workouts, selectWorkout } = useState();
  const { goToNamed } = useRouter();

  const select = (i: number) => {
    selectWorkout(i)
    goToNamed('workout')
  }
</script>

<template>
  <div class="flex flex-col divide-y-2 dark:divide-background-dark divide-background-light">
    <div v-for="(workout, i) in workouts" @click="select(i)"
      class="w-full h-[81px] dark:bg-white/10 bg-black/10 py-1 px-2"
    >
      <p v-text="workout.name" class="font-bold text-2xl leading-none"/>
      <div class="text-lg mt-3">
        <div class="stat-box">
          <inline-svg :src="`icons/reps.svg`" class="inline self-center h-6 aspect-square"/>
          <p v-text="`${workout.reps}`" class="inline-block align-middle"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .stat-box {
    @apply
      border-2 rounded-md border-white/5 bg-white/5 p-1 leading-none h-8 inline-flex items-center divide-x-8 divide-transparent
  }
</style>
