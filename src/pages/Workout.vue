<script setup lang="ts">
  import { useState, useLoop, useRouter } from '@/services/_index';
  import { Button, ProgressWheel, ExerciseDuration } from '@/components/_index';
  import { isWithIn, mapTo, BUTTON_SFX_ARRAY, formatDuration } from '@/util';
  import { watch, computed, onDeactivated, onMounted, onUnmounted, ref, nextTick, reactive } from 'vue';
  import { Workout } from '@/types';

  const { workout, workoutsExists } = useState();
  const { goToNamed } = useRouter();

  type Index = { rep: number, exe: number };
  const index = reactive<Index>({ rep: 0, exe: 0 });
  const setIndex = ({ rep, exe }: Index) => {
    if (!workout.value) return;
    let moved = false;

    if (
      isWithIn(rep, { min: 0, max: workout.value.reps - 1 })
      && index.rep !== rep
    ) { index.rep = rep; moved = true };

    if (
      isWithIn(exe, { min: 0, max: workout.value.exercises.length - 1 })
      && index.exe !== exe
    ) { index.exe = exe; moved = true };

    if (moved) resetProgress();
  }
  const setRep = (n: number) => setIndex({ exe: 0, rep: n });
  const setExe = (n: number) => setIndex({ ...index, exe: n });

  const exercise = computed(() => workout.value ? workout.value.exercises[index.exe] : null);

  const running = ref<boolean>(false);
  const currentTime = ref<number>(0);
  const totalTime = computed(() => exercise.value ? exercise.value.duration * 1000 : 0);
  const progress = computed(() => mapTo(currentTime.value, { from: { min: 0, max: totalTime.value }, to: { min: 0, max: 1 } }));  
  let loopId: number | undefined = undefined;

  const loop = (dt: number) => {
    currentTime.value += dt;
    if (currentTime.value > totalTime.value) next();
  }

  const finish = () => {
    stop();
  }

  const resetProgress = () => currentTime.value = 0;
  const reset = () => setIndex({ rep: 0, exe: 0 });
  const restart = () => {
    reset();
    pause();
  }

  const redo = () => {
    pause();
    resetProgress();
  };
  const back = () => {
    if (!workout.value) return;

    let nextExe = index.exe - 1;
    let nextRep = index.rep;

    if (nextExe < 0) {
      nextRep -= 1;
      if (nextRep < 0) {
        return;
      }
      nextExe = workout.value.exercises.length - 1;
    }

    setIndex({ rep: nextRep, exe: nextExe });
  }
  const next = () => {
    if (!workout.value) return;
    const exeLimit = workout.value.exercises.length - 1;
    const repLimit = workout.value.reps - 1;

    let nextExe = index.exe + 1;
    let nextRep = index.rep;

    if (nextExe > exeLimit) {
    // we've hit execersise limit!
      if (nextRep + 1 > repLimit) {
        // workout end!
        finish();
        return;
      } else {
        nextExe = 0;
        nextRep += 1;
      }
    }

    setIndex({ rep: nextRep, exe: nextExe });
  }

  const start = () => {
    if (loopId !== undefined) return;
    const { add } = useLoop();
    loopId = add(loop);
  }
  const stop = () => {
    if (loopId === undefined) return;
    const { remove } = useLoop();
    remove(loopId);
    loopId = undefined;
  }

  const resume = () => running.value = true;
  const pause = () => running.value = false;
  const toggle = () => running.value = !running.value;
  const completed = computed(() => {
    if (!workout.value) return false;
    return index.exe === workout.value.exercises.length - 1 
        && index.rep === workout.value.reps - 1
        && progress.value >= 1;
  });

  const playbackState = computed(() => {
    if (!workout.value) return 'play';
    return completed.value
      ? 'restart'
      : running.value
        ? 'pause'
        : 'play';
  });

  const backState = computed(() => {
    if (!workout.value) return 'back';
    return progress.value > 0
      ? 'redo'
      : 'back'
  });

  const canGoNext = computed(() => {
    return !(workout.value !== undefined
        && index.rep >= workout.value.reps - 1
        && index.exe >= workout.value.exercises.length - 1)
  });
  const canGoBack = computed(() => !(index.rep === 0 && index.exe === 0));

  watch(running, n => {
    n
      ? start()
      : stop();
  }, { immediate: true });

  watch(workout, () => {
    reset();
    resetProgress();
  })

  onDeactivated(() => { running.value = false; });
</script>

<template>
  <div class="workout-page max-h-[100vh] sm:max-h-[calc(100vh-40px)]">
    <div v-if="workout" class="w-full flex flex-col justify-start items-center">
      <!-- progress wheel area -->
      <div class="p-4 pb-0 w-full flex justify-center">
        <ProgressWheel :percentage="progress" class="grid place-content-center relative" >
          <div v-text="`${currentTime.toPrecision(2)}/${totalTime}`"/>
          <div class="absolute w-full bottom-6 left-0 flex flex-row justify-center items-end space-x-2">
            <Button 
              :onClick="backState === 'back' ? back : redo"
              :clickable="backState === 'back' ? canGoBack : true"
              :sound="{ on: BUTTON_SFX_ARRAY, failed: ['error'] }"
              class="play-back-btn h-14 w-14 mb-1"
            >
              <inline-svg v-if="backState === 'back'" :src="`icons/next.svg`" class="h-[60%] w-[60%] rotate-180"/>
              <inline-svg v-else :src="`icons/redo.svg`" class="h-[60%] w-[60%] -translate-x-[1px]"/>
            </Button>
            <Button 
              :onClick="playbackState !== 'restart' ? toggle : restart" 
              :sound="{ on: (playbackState !== 'pause' ? ['cassette_1', 'cassette_3'] : ['cassette_2']) }" 
              class="play-back-btn h-20 w-20"
            >
              <inline-svg v-if="playbackState === 'play'" :src="`icons/play.svg`" class="h-[60%] w-[60%] translate-x-[2px] translate-y-[1px]"/>
              <inline-svg v-else-if="playbackState === 'pause'" :src="`icons/pause.svg`" class="h-[60%] w-[60%] translate-y-[1px]"/>
              <inline-svg v-else-if="playbackState === 'restart'" :src="`icons/restart.svg`" class="h-[45%] w-[45%] translate-y-[1px]"/>
            </Button>
            <Button 
              :onClick="next"
              :clickable="canGoNext"
              :sound="{ on: BUTTON_SFX_ARRAY, failed: ['error'] }"
              class="play-back-btn h-14 w-14 mb-1"
            >
              <inline-svg :src="`icons/next.svg`" class="h-[60%] w-[60%]"/>
            </Button>
          </div>
        </ProgressWheel>
      </div>
      <!-- set area -->
      <div class="flex justify-start items-center text-3xl w-full max-w-full px-2 pb-2 rounded-md relative h-12">
        <span v-text="`repetition`" class="text-xl leading-none bottom-[125%] underline decoration-accent italic mr-4 absolute"/>
        <!-- set selectors! -->
        <div class="flex items-center justify-start space-x-3 overflow-auto touch-pan-x scrollbar-hide">
          <Button v-for="(_, i) in workout.reps" v-text="i + 1" 
            class="py-1 px-3 text-center border-accent dark:bg-highlight-dark bg-highlight-light rounded-md shadow-xl duration-75 transition-[border-width]"
            :class="{'border-b-4': i == index.rep}" :onClick="() => setRep(i)" :sound="{ on: ['key'] }"
          />
        </div>
      </div>
      <!-- exercise area -->
      <div class="w-full mt-3 px-3 pb-3 overflow-auto scrollbar-hide mb-16">
        <div v-for="{ name, duration }, i in workout.exercises" @click="setExe(i)"
          class="
            first:rounded-t-md last:rounded-b-md w-full flex justify-between text-3xl 
            dark:bg-highlight-dark bg-highlight-light p-4 leading-none
          "
          :class="`${index.exe === i ? 'opacity-100' : 'opacity-50'}`"
        >
          <p v-text="name"/>
          <ExerciseDuration :duration="duration"/>
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

  .play-back-btn {
    @apply dark:bg-highlight-dark bg-highlight-light rounded-full grid place-items-center
      transition-transform duration-[25ms] ease-linear
      scale-100
      active:scale-[95%]
    ;
  }
</style>
