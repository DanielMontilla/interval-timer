<script setup lang="ts">
  import { useState, useLoop, useRouter } from '@/services/_index';
  import { ProgressWheel } from '@/components/_index';
  import { isWithIn, mapTo } from '@/util';
  import { watch, computed, onDeactivated, onMounted, onUnmounted, ref, nextTick } from 'vue';
  import { Workout } from '@/types';

  const { workout, workoutsExists } = useState();
  const { goToNamed } = useRouter();
  
  const rep = ref<number>(0);
  const setRep = (n: number) => {
    if (!workout.value) return;
    if (isWithIn(n, { min: 0, max: workout.value.reps})) rep.value = n;
  };
  
  const exerciseIndex = ref<number>(0);
  const exercise = computed(() => workout.value ? workout.value.exercises[exerciseIndex.value] : null);
  const setExercise = (n: number) => {
    if (!workout.value) return;
    exerciseIndex.value = n;
  }

  const running = ref<boolean>(false);
  const currentTime = ref<number>(0);
  const totalTime = computed(() => exercise.value ? exercise.value.duration * 1000 : 0);
  const progress = computed(() => mapTo(currentTime.value, { from: { min: 0, max: totalTime.value }, to: { min: 0, max: 1 } }));  
  let loopId: number | undefined = undefined;
  const handleLoop = (dt: number) => {
    currentTime.value += dt;
  }

  const start = () => {
    if (loopId !== undefined) return;
    const { add } = useLoop();
    loopId = add(handleLoop);
  }
  const stop = () => {
    if (loopId === undefined) return;
    const { remove } = useLoop();
    remove(loopId);
    loopId = undefined;
  }

  const resume = () => running.value = true;
  const toggle = () => running.value = !running.value;

  watch(running, n => {
    n
      ? start()
      : stop();
  }, { immediate: true })
</script>

<template>
  <div class="workout-page max-h-[100vh]">
    <div v-if="workout" class="w-full flex flex-col justify-start items-center">
      <!-- progress wheel area -->
      <div class="p-4 pb-0 w-full flex justify-center">
        <ProgressWheel :percentage="progress" class="grid place-content-center relative" >
          <div v-text="`${currentTime.toPrecision(2)}/${totalTime}`"/>
          <div class="absolute w-full bottom-8 left-0 flex flex-col justify-center items-center">
            <div @click="toggle" class="dark:bg-highlight-dark bg-highlight-light rounded-full h-12 w-12"/>
          </div>
        </ProgressWheel>
      </div>
      <!-- set area -->
      <div class="flex justify-start items-center text-3xl w-full max-w-full px-2 pb-2 rounded-md relative h-12">
        <span v-text="`repetition`" class="text-xl leading-none bottom-[125%] underline decoration-accent italic mr-4 absolute"/>
        <!-- set selectors! -->
        <div class="flex items-center justify-start space-x-3 overflow-auto touch-pan-x scrollbar-hide">
          <div v-for="(_, i) in workout.reps" v-text="i + 1" 
            class="py-1 px-3 text-center border-accent dark:bg-highlight-dark bg-highlight-light rounded-md shadow-xl duration-75 transition-[border-width]"
            :class="{'border-b-4': i == rep}" @click="setRep(i)"
          />
        </div>
      </div>
      <!-- exercise area -->
      <div class="w-full mt-3 px-3 pb-3 overflow-auto scrollbar-hide mb-16">
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
