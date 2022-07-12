import { useLoop } from '@/services/_index';
import type { IntervalOptions } from '@/types';
import { mapValue } from '@/util';
import { ref, type Ref } from 'vue';

export default class Interval {
   public progress = ref(1);
   public iteration: number = 0;
   public completed: boolean = false;

   public isPaused: Ref<boolean>;
   public iterations: number | 'infinite';
   public time: number;
   public remaining: Ref<number>;
   public onTick?: (dt: number) => void;
   public onIteration?: (iteration: number) => number | void | 'completed';
   public onCompleted?: () => number | void;

   private loopId: number;

   public constructor(options: IntervalOptions) {
      let { time, onTick, onIteration, onCompleted, iterations, paused } = options;

      this.time = time;

      this.isPaused = ref(paused ? paused : false);
      this.iterations = iterations ? iterations : 1;
      this.onTick = onTick;
      this.onIteration = onIteration;
      this.onCompleted = onCompleted;

      this.remaining = ref(this.time);

      const { add } = useLoop();

      this.loopId = add(dt => {
         if (!this.isPaused.value && !this.completed) {
            // not paused
            if (this.onTick) this.onTick(dt);
            let step = this.remaining.value - dt;
            if (step > 0) {
               // time remaining
               this.remaining.value = step;
            } else {
               // time expired
               if (this.iterations > 0 || this.iterations === 'infinite') {
                  // iterations remaining
                  this.iteration++;
                  if (this.onIteration) {
                     let newTime = this.onIteration(this.iteration);
                     if (newTime == 'completed') this.complete();
                     if (typeof newTime === 'number') this.time = newTime;
                  }
                  this.remaining.value = time + step;
                  if (typeof this.iterations === 'number') this.iterations--;
               } else {
                  this.complete();
               }
            }
            this.computeProgress();
         }
      });
   }

   public destroy() {
      const { remove } = useLoop();
      remove(this.loopId);
   }

   private complete() {
      if (this.onCompleted) this.onCompleted();
      this.completed = true;
   }

   private computeProgress() {
      this.progress.value = mapValue([0, this.time], [0, 1], this.remaining.value);
   }

   public toggle() {
      this.isPaused.value = !this.isPaused.value;
   }

   public pause() {
      this.isPaused.value = true;
   }

   public unpause() {
      this.isPaused.value = false;
   }
}
