<script setup lang="ts">
  import { useState, useLoop, useRouter } from '@/services/_index';
  import { ProgressWheel } from '@/components/_index';
  import { isWithIn } from '@/util';
  import { watch, onActivated, onDeactivated, onMounted, onUnmounted, ref, nextTick } from 'vue';
  import { Workout } from '@/types';

  let _loopId = 0;
  const { workout, workoutsExists } = useState();
  const { add, remove } = useLoop();
  const { goToNamed } = useRouter();

  const paused = ref<boolean>(true);
  const progress = ref<number>(0.1);
  
  const rep = ref<number>(0);
  const setRep = (n: number) => {
    if (!workout.value) return;
    if (isWithIn(n, { min: 0, max: workout.value.reps})) rep.value = n;
  };
  
  const exerciseIndex = ref<number>(0);
  const setExercise = (n: number) => {
    if (!workout.value) return;
    exerciseIndex.value = n;
  }

  const handleLoop = (dt: number) => {
    
  }
</script>

<template>
  <div class="workout-page max-h-[100vh]">
    <div v-if="workout" class="w-full flex flex-col justify-start items-center">
      <!-- progress wheel area -->
      <div class="p-4 pb-0 w-full flex justify-center">
        <ProgressWheel :percentage="progress" />
      </div>
      <!-- set area -->
      <div class="flex justify-start items-center text-3xl w-full p-2 pt-0 rounded-md">
        <span v-text="`rep`" class="text-5xl leading-none -translate-y-1 font-bold mr-4"/>
        <div class="flex items-center justify-start space-x-3">
          <div v-for="(_, i) in workout.reps" v-text="i + 1" 
            class="py-1 px-3 text-center border-accent dark:bg-highlight-dark bg-highlight-light rounded-md shadow-xl duration-75 transition-[border-width]"
            :class="{'border-b-4': i == rep}" @click="setRep(i)"
          />
        </div>
      </div>
      <!-- exercise area -->
      <div class="w-full p-4 overflow-auto scrollbar-hide mb-16">
        <div v-for="{ name, duration }, i in workout.exercises" @click="setExercise(i)"
          class="
            first:rounded-t-md last:rounded-b-md w-full flex justify-between text-3xl 
            dark:bg-highlight-dark bg-highlight-light p-4 leading-none
          "
          :class="{'opacity-100': exerciseIndex == i, 'opacity-50': exerciseIndex != i}"
        >
        <p v-text="name"/>
        <p v-text="duration"/>
        </div>
      </div>
    </div>
    <div v-else class="w-full">
      <div v-if="workoutsExists" class="invalid-screen">
        <p class="title-msg" v-text="`No workout\nselected!`"/>
        <p class="sub-msg" v-text="`please select one!`"/>
        <div class="re-btn" @click="goToNamed('select')" v-text="`my workouts`"/>
      </div>
      <div v-else class="invalid-screen">
        <p class="title-msg" v-text="`No workout\ncreated yet!`"/>
        <p class="sub-msg" v-text="`please create one!`"/>
        <div class="re-btn" @click="goToNamed('create')" v-text="`create workout`"/>
      </div>
    </div>
  </div>
</template>

<style scoped>

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

  .workout-page {
    @apply
      flex
  }
</style>
