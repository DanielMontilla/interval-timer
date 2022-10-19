<script setup lang="ts">
  import { useState, useLoop } from '@/services/_index';
  import { ProgressWheel } from '@/components/_index';
  import { computed, onActivated, onDeactivated, ref } from 'vue';
import { Workout } from '@/types';

  const { workout } = useState();
  const { add, remove } = useLoop();

  let _loopId = 0;
  const paused = ref<boolean>(true);
  const progress = ref<number>(0);
  let _exerciseIndex = ref<number>(0);
  const exercise = computed(() => {
    return (workout.value as Workout)[_exerciseIndex.value];
  });

  const handleLoop = (dt: number) => {
    
  }

  onActivated(() => _loopId = add(handleLoop))
  onDeactivated(() => {
    paused.value = true;
    remove(_loopId);
  });
</script>

<template>
  <div class="workout-page">
    <div v-if="workout">
      <ProgressWheel :percentage="0"/>

    </div>
    <div v-else>
      Please select workout!
      TODO: add btn to rederect to select screen
    </div>
  </div>
</template>

<style scoped>
  .workout-page {
    @apply
      flex grow-0
  }
</style>
