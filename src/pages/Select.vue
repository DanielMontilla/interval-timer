<script setup lang="ts">
  import { Button, WorkoutDuration } from '@/components/_index';
  import { useState, useRouter } from '@/services/_index';

  const { workouts, selectWorkout, removeWorkout, workoutsExists, selectEditWorkout } = useState();
  const { goToNamed } = useRouter();

  const select = (id: string) => {
    selectWorkout(id)
    goToNamed('workout')
  }
</script>

<template>
  <div class="p-2">
    <div v-if="workoutsExists" class="flex flex-col space-y-2">
      <div v-for="{ name, reps, exercises }, i  in workouts" 
        @click="select(i)"
        class="
          dark:bg-highlight-dark bg-highlight-light relative
          border-[1px] border-neutral border-opacity-50
          p-3 pt-2 flex flex-col space-y-5 rounded-md drop-shadow-lg
        "
      >
        <div v-text="name" class="xm:text-5xl text-4xl font-bold max-w-[90%] leading-tight"/>
        <div class="flex flex-row items-center justify-start space-x-2">
          <div class="stat-tag">
            <div v-text="reps" class="xm:-translate-y-[1px] self-center"/>
            <div v-text="`rep${reps !== 1 ? 's' : ''}`" class="font-bold self-center"/>
          </div>
          <div class="stat-tag">
            <inline-svg :src="`icons/duration.svg`" class="stat-icon"/>
            <WorkoutDuration total :reps="reps" :exercises="exercises"/>
            <div v-text="`/total`" class="italic text-base leading-none -translate-y-1"/>
          </div>
        </div>
        <div class="absolute -top-5 right-0 p-2 pr-3 m-0 h-full flex flex-col xm:justify-around justify-between">
          <div class="action-cont">
            <Button :sound="{ on: ['key'] }" :onClick="() => selectEditWorkout(i)" stop
              class="action bg-neutral"
            >
              <inline-svg :src="`icons/edit.svg`" class="action-icon"/>
            </Button>
          </div>
          <div class="action-cont">
            <Button :sound="{ on: ['key'] }" :onClick="() => removeWorkout(i)" stop
              class="action bg-red-600"
            >
              <inline-svg :src="`icons/delete.svg`" class="action-icon"/>
            </Button>
          </div>
        </div>
      </div>
      <Button v-text="`new workout`" :onClick="() => goToNamed('create')" :sound="{ on: ['key'] }"
        class="w-full h-16 rounded-md font-bold dark:bg-highlight-dark bg-highlight-light grid place-items-center text-xl drop-shadow-lg border-2 border-dashed border-neutral/50 active:bg-opacity-10"
      />
      <div class="min-h-[60px]" />
    </div>
    <div v-else>
      <div class="invalid-screen">
        <p class="title-msg" v-text="`No workout\ncreated yet!`"/>
        <p class="sub-msg" v-text="`please create one!`"/>
        <div class="re-btn" @click="goToNamed('create')" v-text="`create workout`"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .action-cont {
    @apply w-full h-full grid content-center justify-items-end;
  }
  .action {
    @apply text-lg ring-1 ring-neutral border-b-4 border-neutral rounded-md xm:p-1 p-0 bg-opacity-25
      active:border-none transition-[border-width] duration-75 ease-linear
    ;
  }
  .action-icon {
    @apply h-7 w-7;
  }
  .stat-tag {
    @apply py-1 px-2 flex flex-row items-end space-x-1 min-w-min
      leading-none xm:text-xl text-lg text-black
      bg-neutral bg-opacity-75 rounded-md ring-2 dark:ring-text-light/75 ring-text-dark/75
      min-h-[40px]
    ;
  }
  .stat-icon {
    @apply h-7 w-7 translate-y-[1px] self-center
    ;
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
