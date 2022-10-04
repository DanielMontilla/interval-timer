<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { InputData } from '@/types';
  import { lessThan, lessThanNumeric, moreThanNumeric, notEmpty, isNumber, isInt } from '@/util';
  import { ref } from 'vue';

  type Exercise = { // TODO: move to @/types
    name: InputData<string>,
    duration: InputData<number>
  };

  const name = ref<InputData<string>>({ content: '' });
  const reps = ref<InputData<number>>({ content: 1 });

  const defExercise: Exercise = { name: {content: ''}, duration: {content: 5} };
  const exercises = ref<Exercise[]>([defExercise]);

  const addExercise = (exercise: Exercise = defExercise, at?: number) => {
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

    <div class="w-full border-b-2 border-white"/>

    <div v-for="exercise in exercises" class="exercise-card">
      <Input
        class="text-xl"
        v-model:data="exercise.name"
        label="exercise name"
        :validators="[notEmpty, lessThan(24)]"
      />
      <Input
        class="text-xl"
        v-model:data="exercise.duration"
        label="duration"
        :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(3600 + 1), isInt]"
      />
    </div>
  </div>
</template>

<style scoped>
  .create-page .input-continer + .input-continer {
    @apply
      mt-2
  }
</style>
