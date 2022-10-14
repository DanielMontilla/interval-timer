<script setup lang="ts">
  // made using: @copyright https://www.freecodecamp.org/news/css-only-pie-chart/
  import { clamp } from '@/util';
  import { computed } from 'vue';

  interface ProgressWheelProps {
    percentage: number
  }

  const props = defineProps<ProgressWheelProps>();
  const _percentage = computed(() => clamp(props.percentage, { min: 0, max: 100 }));

</script>

<template>
  <div class="progress-wheel" 
    :style="{'--percentage': `${_percentage}`}">
    <slot/>
  </div>
</template>

<style scoped>
  .progress-wheel {
    @apply
    w-full aspect-square relative z-10
    inline-grid place-content-center
  }
  
  .progress-wheel::before {
    --gap: 80deg;
    --thickness: 33%;

    --total: calc(360deg - var(--gap));
    --completed: calc(var(--total) * var(--percentage) / 100);

    /* background: conic-gradient(green var(--percentage),transparent 0); */

    background: conic-gradient(
      from calc(180deg + var(--gap) / 2),
      green               0                         var(--completed),
      rgba(0, 0, 0, 0.1)  var(--completed)          calc(360deg - var(--gap)),
      transparent           calc(360deg - var(--gap)) 360deg
    );

    mask: 
      radial-gradient(
        farthest-side, 
        transparent calc(99% - var(--thickness)),
        black     calc(100% - var(--thickness))
      );

    @apply
      content-[''] absolute rounded-full inset-0 antialiased
  }
</style>
