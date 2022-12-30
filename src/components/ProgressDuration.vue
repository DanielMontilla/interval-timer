<script setup lang="ts">
  import { formatProgDuration } from '@/util';
  import { computed, ref } from 'vue';

  interface ProgressDurationProps {
    time: number;
  }

  const props = defineProps<ProgressDurationProps>();
  const time = computed(() => formatProgDuration(props.time));
  const breakPoint = computed(() => {
    const s = `${time.value.seconds}`;
    let bp = 1;

    for (const _ of s) {
      bp -= 0.075
    }

    return { '--bp':  bp }
  })
</script>
<template>
  <div class="flex content-center font-mono items-end leading-none relative tainer" :style="breakPoint">
    <div v-text="time.seconds" class="seconds"/>
    <div v-text="time.miliseconds" class="miliseconds"/>
  </div>
</template>

<style scoped>
  .tainer {
    transform: scale(var(--bp));
  }
  .seconds {
    @apply font-extrabold;
    font-size: calc(clamp(64px, 25vw, 128px) * var(--bp));
  }
  .miliseconds {
    @apply text-2xl italic absolute left-full bottom-[10%];
  }
</style>
