<script setup lang="ts">
  import { useState, useRouter } from '@/services/_index';

  const { workouts, selectWorkout, removeWorkout, workoutsExists } = useState();
  const { goToNamed } = useRouter();

  const select = (id: string) => {
    selectWorkout(id)
    goToNamed('workout')
  }
</script>

<template>
  <div>
    <div v-if="workoutsExists" class="flex flex-col divide-y-2 dark:divide-background-dark divide-background-light">
      <div v-for="(workout, id) in workouts" @click="select(id)" :key="id"
        class="w-full h-[81px] bg-highlight-light dark:bg-highlight-dark py-1 px-2"
      >
      <span class="flex gap-2 items-center">
        <p v-text="workout.name" class="font-bold text-2xl leading-none"/>
        <div @click.stop="removeWorkout(id)" class="h-4 w-4 rounded-full bg-red-900"/>
      </span>
        <div class="text-lg mt-3">
          <div class="stat-box">
            <inline-svg :src="`icons/reps.svg`" class="inline self-center h-6 aspect-square"/>
            <p v-text="`${workout.reps}`" class="inline-block align-middle"/>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="invalid-screen h-full">
      <p class="title-msg" v-text="`No workout\ncreated yet!`"/>
      <p class="sub-msg" v-text="`please create one!`"/>
      <div class="re-btn" @click="goToNamed('create')" v-text="`create workout`"/>
    </div>
  </div>
</template>

<style scoped>
  .stat-box {
    @apply
      border-2 rounded-md border-white/5 bg-white/5 p-1 leading-none h-8 inline-flex items-center divide-x-8 divide-transparent
  }

  .invalid-screen {
    @apply w-full h-[90vh] flex flex-col items-center justify-center text-center space-y-4;
  }

  .title-msg {
    @apply text-5xl font-bold whitespace-pre;
  }

  .sub-msg {
    @apply text-xl font-light italic;
  }

  .re-btn {
    @apply py-3 px-4 leading-tight rounded-md drop-shadow-lg text-xl
    dark:bg-highlight-dark bg-highlight-light;
  }
</style>
