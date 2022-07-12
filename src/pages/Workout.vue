<script setup lang="ts">
   import { useWorkout } from '@/services/_index';
   import { Interval } from '@/classes/_index';
   import { mapValue } from '@/util';
   import { computed, ref } from 'vue';

   const { currentWorkout: workout } = useWorkout();
   const currentExerciseIndex = ref(0);
   const exercise = computed(() => workout.value.exercises[currentExerciseIndex.value]);
   const interval = new Interval({
      time: exercise.value.secs,
      iterations: 'infinite',
      onIteration: () => {},
      paused: true,
   });
</script>

<template>
   <div class="workout page d-grid">
      <div class="details">
         <div class="name">
            {{ workout.name }}
         </div>
      </div>
      <div class="timer-area d-grid max-width">
         <div class="current-exercise">
            {{ exercise.name }}
         </div>
         <div
            class="timer"
            :style="{
               '--percentage': 1 - interval.progress.value,
            }"
         >
            <div class="timer-text">{{ interval.remaining.value.toFixed(1) }}s</div>
            <div class="actions d-flex">
               <div class="return-action action-btn">
                  <img class="action-icon" src="@/assets/icons/skip.svg" />
               </div>
               <div class="play-action action-btn" @click="interval.toggle">
                  <img
                     class="action-icon"
                     :src="`src/assets/icons/${
                        interval.isPaused.value ? 'resume' : 'pause'
                     }.svg`"
                  />
               </div>
               <div class="skip-action action-btn">
                  <img class="action-icon" src="@/assets/icons/skip.svg" />
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .workout > * + * {
      margin-top: var(--md);
   }
   .name {
      font-size: var(--xl3);
      font-weight: bold;
   }
   .timer-area {
      /* width: 100%; */
      height: auto;
      padding: 0 var(--md);
      grid-template-columns: minmax(auto, var(--max-viewport));
      grid-template-rows: auto auto;
      grid-template-areas: 'name' 'timer';
   }

   .current-exercise {
      grid-area: name;
   }

   * {
      --thickness: calc(100% / 3);
      --gap: 80deg;
   }

   /** @copyright https://www.freecodecamp.org/news/css-only-pie-chart/ */
   .timer {
      grid-area: timer;
      position: relative;
      aspect-ratio: 1;

      width: 100%;

      display: inline-grid;
      place-content: center;
   }
   .timer:before {
      content: '';
      position: absolute;
      inset: 0;

      --total: calc(360deg - var(--gap));
      --completed-deg: calc(var(--total) * var(--percentage));

      background: conic-gradient(
         from calc(180deg + var(--gap) / 2),
         hsla(var(--succ-dark), 1) 0 var(--completed-deg),
         hsla(var(--highlight-dark), 0.05) var(--completed-deg) calc(360deg - var(--gap)),
         transparent calc(360deg - var(--gap)) 360deg
      );

      clip-path: circle(50%);

      -webkit-mask: radial-gradient(
         farthest-side,
         transparent calc(99% - var(--thickness)),
         black calc(100% - var(--thickness))
      );
      mask: radial-gradient(
         farthest-side,
         transparent calc(99% - var(--thickness)),
         black calc(100% - var(--thickness))
      );
   }

   .timer-text {
      font-size: var(--xl2);
   }

   * {
      --action-height: var(--xl4);
   }

   .actions {
      position: absolute;
      width: 100%;
      height: var(--action-height);
      bottom: var(--lg);
   }

   .actions > * + * {
      margin-left: var(--md);
   }

   .action-btn {
      background-color: hsla(var(--highlight-dark), 0.05);
      height: var(--action-height);
      width: var(--action-height);

      display: grid;
      justify-items: center;
      align-items: center;

      padding: 2px;
      border-radius: 50%;
   }
   .action-icon {
      filter: var(--f-white);
      height: 50%;
      width: 50%;
   }

   .return-action {
      transform: rotate(180deg);
   }
</style>
