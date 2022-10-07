<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { InputData, Exercise } from '@/types';
  import { lessThan, lessThanNumeric, moreThanNumeric, notEmpty, isNumber, isInt, DEF_EXERCISE, ACTIONS } from '@/util';
  import { ref } from 'vue';

  const name = ref<InputData<string>>({ content: '' });
  const reps = ref<InputData<number>>({ content: 1 });

  const exercises = ref<Exercise[]>([DEF_EXERCISE]);

  const addExercise = (exercise: Exercise = DEF_EXERCISE, at?: number) => {
    if (at) {

      // TODO:
    } else {
      exercises.value.push(exercise)
    }
  }
  
</script>

<template>
  <div class="create-page">
    <Input 
      class="text-3xl"
      v-model:data="name" 
      label="workout name" 
      :validators="[notEmpty, lessThan(50)]"
    />
    <Input 
      class="text-3xl"
      v-model:data="reps" 
      label="reps" 
      :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(1001), isInt]"
    />

    <div class="w-full border-b-2 border-black/10 dark:border-white/10 mb-4"/>

    <div v-for="exercise in exercises" class="exercise-card">
      <Input
        class="text-xl"
        v-model:data="exercise.name"
        label="exercise name"
        :validators="[notEmpty, lessThan(24)]"
      />
      <div class="exercise-bottom">
        <Input
          class="text-xl duration-input"
          v-model:data="exercise.duration"
          label="duration"
          :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(3600 + 1), isInt]"
        />
        <div class="actions">
          <div v-for="action in ACTIONS" class="action-btn">
            <inline-svg :src="`icons/${action}.svg`" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .create-page .input-continer + .input-continer {
    @apply
      mt-2
  }

  .exercise-bottom {
    @apply
      grid grid-cols-2 grid-rows-1
  }
  .duration-input {
    @apply
      row-span-1 col-span-1
  }
  .actions {
    @apply
      flex justify-evenly place-items-center mb-5
      row-span-1 col-span-1 
  }
  .action-btn {
    @apply
      grid place-content-center w-10 h-10 aspect-square p-1 rounded-md
      bg-white/10
  }

  svg {
    @apply
    h-full w-full aspect-square
  }
</style>
