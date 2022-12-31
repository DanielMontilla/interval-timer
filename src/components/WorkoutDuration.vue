<script setup lang="ts">
  import { Exercise } from '@/types';
  import { formatWorkoutDuration } from '@/util';
  import { computed } from 'vue';

  interface WorkoutDurationProps {
    reps: number,
    exercises: Exercise[],
    total?: boolean
  }

  const props = defineProps<WorkoutDurationProps>();
  const duration = computed(() => formatWorkoutDuration({
    exercises: props.exercises,
    reps: props.reps,
    total: props.total ? props.total : false
  }));
</script>
<template>
  <div class="flex flex-row space-x-2">
    <div class="tainer" v-if="duration.hours">
      <div class="value" v-text="duration.hours"/>
      <div class="unit" v-text="`h`"/>
    </div>
    <div class="tainer" v-if="duration.minutes">
      <div class="value" v-text="duration.minutes"/>
      <div class="unit" v-text="`m`"/>
    </div>
    <div class="tainer" v-if="duration.seconds">
      <div class="value" v-text="duration.seconds"/>
      <div class="unit" v-text="`s`"/>
    </div>
  </div>
</template>

<style scoped>
  .tainer {
    @apply flex flex-row items-end space-x-[1px];
  }
  .value {
    @apply text-2xl font-semibold;
  }
  .unit {
    @apply text-base italic;
  }
</style>
