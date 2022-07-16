<script setup lang="ts">
   import { useWorkout, useVoice } from '@/services/_index';
   import { Interval } from '@/classes/_index';
   import { computed, onUnmounted, ref, watch } from 'vue';
   import { ReturnBtn } from '@/components/_index';

   const { currentWorkout: workout } = useWorkout();
   const { say } = useVoice();
   const currentExerciseIndex = ref({ rep: 0, exercise: 0 });
   const exercise = computed(
      () => workout.value.exercises[currentExerciseIndex.value.exercise]
   );

   const interval = new Interval({
      time: exercise.value.secs,
      iterations: 'infinite',
      onIteration: () => {
         if (!switchNext(true)) return 'completed';
      },
      onCompleted: () => {
         interval.pause();
      },
      paused: true,
   });

   watch(exercise, e => {
      interval.reset({
         time: e.secs,
      });
   });

   const isRep = (i: number) => currentExerciseIndex.value.rep == i;
   const isExercise = (i: number, j: number) =>
      currentExerciseIndex.value.rep == i && currentExerciseIndex.value.exercise == j;

   const switchTo = (i: number, j: number, speak?: boolean) => {
      currentExerciseIndex.value = { rep: i, exercise: j };
      if (!interval.isPaused.value) speak = true;
      if (speak) say(`${exercise.value.name} for ${exercise.value.secs} seconds`, true);
   };

   const switchNext = (speak?: boolean) => {
      let { exercise, rep } = currentExerciseIndex.value;

      let lastExercise = workout.value.exercises.length - 1;
      let lastRep = workout.value.reps - 1;

      if (exercise === lastExercise) {
         if (rep === lastRep) return false;
         exercise = 0;
         rep++;
      } else {
         exercise++;
      }

      switchTo(rep, exercise, speak);
      return true;
   };
   const switchPrev = (speak?: boolean) => {
      let { exercise, rep } = currentExerciseIndex.value;
      let lastExercise = workout.value.exercises.length - 1;

      if (exercise === 0) {
         if (rep === 0) return false;
         exercise = lastExercise;
         rep--;
      } else {
         exercise--;
      }

      switchTo(rep, exercise, speak);
      return true;
   };

   const restart = () => {
      switchTo(0, 0);
      interval.toggle();
   };

   const playClick = () => {
      if (interval.completed.value) {
         restart();
      } else {
         if (interval.progress.value === 1)
            say(`${exercise.value.name} for ${exercise.value.secs} seconds`);
         interval.toggle();
      }
   };

   onUnmounted(() => {
      interval.destroy(); // required. otherwise raf will trigger endlessly
   });
</script>

<template>
   <div class="workout page d-grid">
      <div class="details">
         <div class="name-area">
            <ReturnBtn :back-path="'/select'" class="return-btn" />
            <div class="name-text">
               {{ workout.name }}
            </div>
         </div>
      </div>
      <div class="timer-area d-grid max-width">
         <div
            class="timer"
            :style="{
               '--percentage': interval.completed.value ? 0 : 1 - interval.progress.value,
            }"
         >
            <div v-if="!interval.completed.value" :style="{ marginBottom: '8px' }">
               <div class="rep-number">
                  rep {{ currentExerciseIndex.rep + 1 }}&nbsp;/<span
                     :style="{ fontSize: 'var(--md)' }"
                     >&nbsp;{{ workout.reps }}</span
                  >
               </div>
               <div class="timer-seconds">{{ interval.remaining.value.toFixed(1) }}s</div>
               <div class="exercise-name">
                  {{ exercise.name }}
               </div>
            </div>
            <div v-else class="timer-end d-grid" @click="restart">
               <img class="end-icon" src="/icons/restart.svg" />
            </div>
            <div class="actions d-flex">
               <div class="return-action action-btn" @click="switchPrev()">
                  <img class="action-icon" src="/icons/skip.svg" />
               </div>
               <div class="play-action action-btn" @click="playClick">
                  <img
                     class="action-icon"
                     :src="`/icons/${interval.isPaused.value ? 'resume' : 'pause'}.svg`"
                  />
               </div>
               <div class="skip-action action-btn" @click="switchNext()">
                  <img class="action-icon" src="/icons/skip.svg" />
               </div>
            </div>
         </div>
      </div>
      <div class="exercise-list">
         <div v-for="(rep, i) in workout.reps" class="rep-card">
            <div class="rep-label">
               <span
                  :style="{
                     textDecoration: isRep(i) ? 'underline' : 'none',
                  }"
               >
                  <span :style="{ fontStyle: 'italic' }">Rep</span> {{ rep }}
               </span>
            </div>
            <div
               v-for="(exercise, j) in workout.exercises"
               class="exercise-card d-flex"
               :style="{
                  backgroundColor: isExercise(i, j)
                     ? 'hsla(var(--highlight-dark), 0.025)'
                     : 'transparent',
               }"
               @click="switchTo(i, j)"
            >
               <span
                  class="exercise-number"
                  :style="{ fontWeight: isExercise(i, j) ? 'bold' : 'normal' }"
                  >{{ j + 1 }}</span
               >
               <span class="exercise-label-name">{{ exercise.name }}</span>
               <span :style="{ opacity: 0.2, margin: '0 var(--md)' }">•</span>
               <span class="exercise-time"> {{ exercise.secs }}s </span>
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .workout {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto auto;
      grid-template-areas: 'details' 'timer-area' 'exercise-list';
   }
   .details {
      grid-area: details;
      justify-self: start;
   }
   .name-area {
      display: flex;
      justify-content: start;
      align-content: center;
      align-items: center;
   }

   .name-text {
      font-size: var(--xl3);
      font-weight: bold;
   }

   .return-btn {
      min-width: var(--xl5);
   }

   .timer-area {
      grid-area: timer-area;
      height: auto;
      padding: 0 var(--md);
      grid-template-columns: minmax(auto, var(--max-viewport));
      grid-template-rows: auto;
      grid-template-areas: 'timer';

      text-align: center;
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

      grid-template: auto auto / auto;
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

   .rep-number {
      text-align: center;
      font-size: var(--lg);
      opacity: 60%;
   }

   .timer-seconds {
      font-size: var(--xl5);
      font-weight: 500;
      line-height: 1;
   }

   .timer-end {
      background-color: hsla(var(--highlight-dark), 0.05);
      border-radius: 50%;
      height: calc(var(--base) * 12);
      width: calc(var(--base) * 12);
   }
   .end-icon {
      height: calc(var(--base) * 10);
      width: calc(var(--base) * 10);

      filter: var(--f-white);
   }

   .exercise-name {
      text-align: center;
      font-size: var(--xl);
      font-style: italic;
      line-height: 0.8;
   }

   * {
      --action-height: var(--xl3);
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

   .play-action {
      height: var(--xl5);
      width: var(--xl5);
   }
   .action-icon {
      filter: var(--f-white);
      height: 50%;
      width: 50%;
   }

   .return-action {
      transform: rotate(180deg);
   }

   .exercise-list {
      width: 100%;
      grid-area: exercise-list;
      justify-self: start;
      padding: 0 var(--md);
   }

   .exercise-list > * + * {
      border-top: var(--sx) dotted hsla(var(--highlight-dark), 0.05);
      padding-top: var(--md);
   }

   .rep-label {
      font-size: var(--xl2);
      font-weight: 500;
      line-height: 1;
      margin-top: var(--sx);
      margin-bottom: var(--sm);
   }

   .exercise-card {
      margin-top: var(--sx);
      margin-bottom: var(--sx);
      font-size: var(--lg3);
      border-radius: var(--sm);
      padding: var(--sxx) var(--sm);
      justify-content: start;

      transition: background-color 0.025s linear;
   }

   .exercise-number {
      margin-right: var(--lg);
   }

   .exercise-time {
      font-style: italic;
   }
</style>
