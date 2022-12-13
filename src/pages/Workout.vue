<script setup lang="ts">
  import { useState, useLoop } from '@/services/_index';
  import { ProgressWheel } from '@/components/_index';
  import { computed, onActivated, onDeactivated, ref } from 'vue';
  import { Workout } from '@/types';

  let _loopId = 0;
  const { workout } = useState();
  const { add, remove } = useLoop();

  const paused = ref<boolean>(true);
  const progress = ref<number>(0.99);
  const exerciseIndex = ref<number>(0);

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
    <div v-if="workout" class="w-full p-2">
      <ProgressWheel :percentage="progress"/>

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
