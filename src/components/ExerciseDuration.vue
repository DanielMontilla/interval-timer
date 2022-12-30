<script setup lang="ts">
  import { formatDuration } from '@/util';
  import { computed, onUpdated } from 'vue';

  interface ExerciseDurationProps {
    duration: number;
  }

  const props = defineProps<ExerciseDurationProps>();
  const duration = computed(() => formatDuration(props.duration));
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
    <div class="tainer" v-if="duration.miliseconds">
      <div class="value" v-text="duration.miliseconds"/>
      <div class="unit" v-text="`ms`"/>
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
