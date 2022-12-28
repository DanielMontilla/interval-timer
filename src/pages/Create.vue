<script setup lang="ts">
  import { Input } from '@/components/_index'
  import { InputData, ExerciseData, Action } from '@/types';
  import { exerciseNameSchema, workoutNameSchema, repsSchema, durationSchema } from '@/validation';
  import { DEF_INPUT_DATA, DEF_EXERCISE_DATA, ACTIONS_ARRAY, validateInputData } from '@/util'
  import { ref, computed } from 'vue';
  import { v4 as genId } from 'uuid';
import { INVALID } from 'zod';

  const workoutName = ref<InputData>(DEF_INPUT_DATA);
  const reps = ref<InputData>(DEF_INPUT_DATA);
  const exercises = ref<{id: string, data: ExerciseData}[]>([{ id: genId(), data: {...DEF_EXERCISE_DATA}}]);

  const onSubmit = () => {
    let result = true;
    const invalidate = () => result ? result = false : null;

    if (workoutName.value.state !== 'valid') {
      invalidate();
      workoutName.value = validateInputData(
        workoutName.value.content,
        workoutNameSchema,
      );
    }
    
    if (reps.value.state !== 'valid') {      
      invalidate();
      reps.value = validateInputData(
        reps.value.content,
        repsSchema,
      );
    }
    
    for (let i = 0; i < exercises.value.length; i++) {
      const { data: { duration, name } } = exercises.value[i];
      if (name.state !== 'valid') {
        invalidate();
        exercises.value[i].data.name = validateInputData(
          name.content,
          exerciseNameSchema
        )
      }
      if (duration.state !== 'valid') {
        invalidate();
        exercises.value[i].data.duration = validateInputData(
          duration.content,
          durationSchema
        )
      }
    }

    return result;
  }
  const addExercise = (
    at: number = exercises.value.length,
    data = DEF_EXERCISE_DATA,
    id: string = genId()
  ) => exercises.value.splice(at + 1, 0, { id, data: { ...data } });

  const copyExercise = (
    at: number
  ) => addExercise(at, exercises.value[at].data);

  const deleteExercise = (
    at: number
  ) => exercises.value.splice(at, 1);

  const moveExercise = (
    direction: 'up' | 'down'
  ) => (
    at: number
  ) => {
    const { data, id } = deleteExercise(at)[0];
    const pivot = direction === 'down' ? at : at - 2;
    addExercise(pivot, data, id);
  }

  const handleAction: Record<Action, (at: number) => void> = {
    add: addExercise,
    copy: copyExercise,
    delete: deleteExercise,
    movedown: moveExercise('down'),
    moveup: moveExercise('up')
  }

  const canPerformAction: Record<Action, (at: number) => boolean> = {
    add: (at) => at < exercises.value.length - 1,
    copy: (at) => exercises.value[at].data.name.content !== '' || exercises.value[at].data.duration.content !== '',
    delete: () => exercises.value.length > 1,
    movedown: (at) => at + 1 < exercises.value.length,
    moveup: (at) => at - 1 >= 0
  }

</script>

<template>
  <div class="flex flex-col p-2 sm:p-4">
    <!-- General Workout info -->
    <Input
      label="Workout Name"
      labelClass="text-3xl"
      inputClass="text-xl"
      :schema="workoutNameSchema"
      v-model:data="workoutName"
      />
      <Input
      label="Reps"
      class="mt-3 mb-1"
      labelClass="text-3xl"
      inputClass="text-xl"
      :schema="repsSchema" isNumber
      v-model:data="reps"
    />
    <!-- Exercises -->
    <TransitionGroup name="exercise-list">
      <div v-for="{ id, data: { name, duration } }, i in exercises" :key="id" class="mt-7">
        <div
          class="exercise-el space-y-2 p-2 pt-4 outline-2 outline-dashed rounded-md outline-opacity-50 relative dark:bg-background-dark bg-background-light"
          :class="`${
            name.state === 'invalid' || duration.state === 'invalid'
              ? `outline-red-800`
              : `outline-neutral`
          }`"
        >
          <!-- exercise label and actions! -->
          <div class="grid grid-cols-2 place-items-center absolute w-full inset-0 h-10 -translate-y-5">
            <span v-text="`Exercise #${i + 1}`" 
              class="px-1 col-start-1 col-end-1 justify-self-start leading-none ml-2 sm:text-3xl text-2xl dark:bg-background-dark bg-background-light font-bold"
            />
            <div 
              class="col-start-2 col-end-2 justify-self-end flex flex-row items-center justify-center sm:mr-4 sm:pr-1 mr-2 dark:bg-background-dark bg-background-light"
            >
            <div v-for="action in ACTIONS_ARRAY" :key="action"
              class="dark:bg-highlight-dark bg-highlight-light p-1 ml-1 rounded-md"
              v-show="canPerformAction[action](i)"
              @click="handleAction[action](i)"
            >
              <inline-svg :src="`icons/${action}.svg`" class="h-7 w-7 sm:h-8 sm:w-8"/>
            </div>
            </div>
          </div>
  
          <!-- inputs! -->
          <Input
            :label="`Name`"
            labelClass="sm:text-xl text-base"
            :schema="exerciseNameSchema"
            v-model:data="exercises[i].data.name"
            />
            <Input
            label="Duration"
            labelClass="sm:text-xl text-base"
            :schema="durationSchema" isNumber
            v-model:data="exercises[i].data.duration"
          />
        </div>
      </div>
    </TransitionGroup>
    <!-- add execirse to end! -->
    <div 
      @click="addExercise()"
      class="py-2 mb-4 outline-2 outline outline-neutral/80 w-full grid place-items-center mt-4 rounded-md dark:bg-highlight-dark bg-highlight-light bg-opacity-50"
    >
      <inline-svg src="icons/add.svg" class="h-10 dark:text-neutral text-text-light"/>
    </div>
    <div class="grid place-items-center w-full">
      <div @click="onSubmit"
        class="h-14 w-32 leading-none bg-accent text-white text-2xl rounded-md font-bold grid place-items-center"
        v-text="`create`"
      />
    </div>
    <div class="mb-16"/>
  </div>
</template>
<style scoped>
  .exercise-el {
    transition: outline-color 0.15s linear;
  }

  .exercise-list-move,
  .exercise-list-enter-active,
  .exercise-list-leave-active {
    transition: transform 0.25s ease-in, opacity 0.25s linear;
  }
  .exercise-list-enter-from{
    opacity: 0;
    transform: translateX(256px);
  }
  .exercise-list-leave-to {
    opacity: 0;
    transform: translateX(0);
  }
  .exercise-list-leave-active {
    width: 100%;
    position: absolute;
  }
</style>
