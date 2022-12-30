<script setup lang="ts">
  import { Button, Input } from '@/components/_index'
  import { InputData, ExerciseData, Action, Workout, Exercise } from '@/types';
  import { exerciseNameSchema, workoutNameSchema, repsSchema, durationSchema } from '@/validation';
  import { DEF_INPUT_DATA, DEF_EXERCISE_DATA, ACTIONS_ARRAY, validateInputData, wait, BUTTON_SFX_ARRAY, defineOptions } from '@/util'
  import { computed, onActivated, onDeactivated, ref, watch, nextTick } from 'vue';
  import { v4 as genId } from 'uuid';
  import { useRouter, useState } from '@/services/_index';

  const { editing, stopEditing } = useState();

  const workoutName = ref<InputData>(DEF_INPUT_DATA);
  const workoutReps = ref<InputData>(DEF_INPUT_DATA);
  const workoutExercises = ref<{id: string, data: ExerciseData}[]>([{ id: genId(), data: {...DEF_EXERCISE_DATA}}]);
  const screenEl = ref<HTMLDivElement>();

  const redirecting = ref<boolean>(false);

  const onSubmit = async () => {
    let result = true;
    const invalidate = () => result ? result = false : null;

    if (workoutName.value.state !== 'valid') {
      invalidate();
      workoutName.value = validateInputData(
        workoutName.value.content,
        workoutNameSchema,
      );
    }
    
    if (workoutReps.value.state !== 'valid') {      
      invalidate();
      workoutReps.value = validateInputData(
        workoutReps.value.content,
        repsSchema,
      );
    }
    
    for (let i = 0; i < workoutExercises.value.length; i++) {
      const { data: { duration, name } } = workoutExercises.value[i];
      if (name.state !== 'valid') {
        invalidate();
        workoutExercises.value[i].data.name = validateInputData(
          name.content,
          exerciseNameSchema
        )
      }
      if (duration.state !== 'valid') {
        invalidate();
        workoutExercises.value[i].data.duration = validateInputData(
          duration.content,
          durationSchema
        )
      }
    }

    if (!result) return;

    const { addWorkout, editWorkout } = useState();
    const { goToNamed } = useRouter();
    const name = workoutName.value.content;
    const reps = Number.parseInt(workoutReps.value.content);
    const exercises: Exercise[] = workoutExercises.value.map(
      ({ data: { name, duration } }) => ({
        name: name.content,
        duration: Number.parseFloat(duration.content),
      })
    );

    const workout: Workout = { name, reps, exercises };

    editing.value
      ? editWorkout(editing.value.id, workout)
      : addWorkout(workout, { redirect: false, select: true });
    
    redirecting.value = true;
    await wait(1500);
    goToNamed('workout');
    await wait(500);
    redirecting.value = false;
    reset();
  }

  const scrollTo = (at: number) => {
    if (!screenEl.value) return;
    const el = Array.from(screenEl.value.children).filter(el => el.classList.contains('exerciseItemEl'))[at] as HTMLDivElement;
    const top = at < 0 ? 0 : el.offsetTop;
    screenEl.value.parentElement?.scrollTo({ behavior: 'smooth', top })
  }

  const addExercise = async (opts?: Partial<{
    at: number,
    data: ExerciseData,
    id: string,
    move: boolean
  }>) => {
    const { at, data, id, move } = defineOptions(opts, {
      at: workoutExercises.value.length,
      data: DEF_EXERCISE_DATA,
      id: genId(),
      move: true
    })

    workoutExercises.value.splice(at + 1, 0, { id, data: { ...data } });

    if (!move) return;
    await nextTick();
    scrollTo(at);
  };

  const copyExercise = (
    at: number
  ) => addExercise({ at, data: workoutExercises.value[at].data });

  const deleteExercise = (
    at: number
  ) => workoutExercises.value.splice(at, 1);

  const moveExercise = (
    direction: 'up' | 'down'
  ) => (
    at: number
  ) => {
    const { data, id } = deleteExercise(at)[0];
    const pivot = direction === 'down' ? at : at - 2;
    addExercise({at: pivot, data, id});
  }

  const handleAction: Record<Action, (at: number) => void> = {
    add: at => addExercise({ at }),
    copy: copyExercise,
    delete: deleteExercise,
    movedown: moveExercise('down'),
    moveup: moveExercise('up')
  }

  const canPerformAction: Record<Action, (at: number) => boolean> = {
    add: () => true,
    copy: () => true,
    delete: () => workoutExercises.value.length > 1,
    movedown: (at) => at + 1 < workoutExercises.value.length,
    moveup: (at) => at - 1 >= 0
  }

  const reset = () => {
    workoutName.value = DEF_INPUT_DATA;
    workoutReps.value = DEF_INPUT_DATA;
    workoutExercises.value.splice(1, workoutExercises.value.length - 1);
    workoutExercises.value[0].data = { duration: DEF_INPUT_DATA, name: DEF_INPUT_DATA };
  }

  watch(editing, e => {
    if (!e) return;
    reset();
    const { workout: { name, reps, exercises } } = e;
    const f = (value: string | number): InputData => ({ content: `${value}`, state: 'valid', msg: undefined });
    workoutName.value = f(name);
    workoutReps.value = f(reps);
    workoutExercises.value.splice(0, workoutExercises.value.length);
    exercises.forEach(({ name, duration }) => {
      addExercise({ at: workoutExercises.value.length - 1, data: { name: f(name), duration: f(duration) }, move: false });
    })
  }, { immediate: true, deep: false });

</script>

<template>
  <div ref="screenEl" class="flex flex-col p-2 sm:p-4" :class="`${ redirecting ? 'pointer-events-none' : 'pointer-events-auto'}`">
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
      v-model:data="workoutReps"
    />
    <!-- Exercises -->
    <TransitionGroup name="exercise-list">
      <div v-for="{ id, data: { name, duration } }, i in workoutExercises" :key="id" class="first:mt-7 mt-10 exerciseItemEl">
        <div
          class="exercise-el space-y-2 p-2 pt-4 outline-2 outline-dashed rounded-md outline-opacity-50 relative dark:bg-background-dark bg-background-light"
          :class="`${
            name.state === 'invalid' || duration.state === 'invalid'
              ? `outline-red-800`
              : `outline-neutral`
          }`"
        >
          <!-- exercise label and actions! -->
          <div class="grid grid-cols-2 place-items-center absolute w-full inset-0 h-10 -translate-y-7">
            <span v-text="`Exercise #${i + 1}`" 
              class="px-1 col-start-1 col-end-1 justify-self-start leading-none ml-2 sm:text-3xl text-2xl dark:bg-background-dark bg-background-light font-bold rounded-md"
            />
            <div 
              class="col-start-2 col-end-2 justify-self-end flex flex-row items-center py-1 justify-center sm:mr-2 sm:pr-1 mr-2 dark:bg-background-dark bg-background-light rounded-md"
            >
            <TransitionGroup name="action-btn">
              <Button v-for="action in ACTIONS_ARRAY" :key="action"
                :sound="{ on: BUTTON_SFX_ARRAY, failed: ['error'] }"
                :clickable="canPerformAction[action](i)"
                :cooldown="300"
                :onClick="() => handleAction[action](i)"
                class="dark:bg-highlight-dark bg-highlight-light p-1 ml-1 rounded-md"
              >
                <inline-svg :src="`icons/${action}.svg`" class="h-7 w-7 sm:h-8 sm:w-8"/>
              </Button>
            </TransitionGroup>
            </div>
          </div>
  
          <!-- inputs! -->
          <Input
            :label="`Name`"
            labelClass="sm:text-xl text-base"
            :schema="exerciseNameSchema"
            v-model:data="workoutExercises[i].data.name"
            />
            <Input
            label="Duration (s)"
            labelClass="sm:text-xl text-base"
            :schema="durationSchema" isNumber
            v-model:data="workoutExercises[i].data.duration"
          />
        </div>
      </div>
    </TransitionGroup>
    <!-- add execirse to end! -->
    <Button 
      :onClick="addExercise"
      :sound="{ success: ['key'] }"
      class="py-2 mb-4 outline-2 outline outline-neutral/80 w-full grid place-items-center mt-4 rounded-md dark:bg-highlight-dark bg-highlight-light bg-opacity-50"
    >
      <inline-svg src="icons/add.svg" class="h-10 dark:text-neutral text-text-light"/>
    </Button>
    <div class="grid place-items-center grid-cols-2 w-full">
      <Button :onClick="onSubmit" :sound="{ success: ['click'] }" :disabled="redirecting"
        class="transition-[border-width] duration-75 ease-linear border-b-4 ring-1 ring-neutral border-neutral active:border-none h-14 w-32 leading-none bg-highlight-light dark:bg-highlight-dark text-accent text-3xl rounded-md font-bold grid place-items-center"
        :class="`${ editing ? 'col-span-1' : 'col-span-2' }`"
        v-text="`${ editing ? 'save' : 'create' }`"
      />
      <Button v-if="editing" :onClick="() => { stopEditing(); reset(); }" :sound="{ success: ['click'] }" :disabled="redirecting"
        class="transition-[border-width] duration-75 ease-linear border-b-4 ring-1 ring-neutral border-neutral active:border-none h-14 w-32 leading-none bg-highlight-light dark:bg-highlight-dark text-red-900 text-3xl rounded-md font-bold grid place-items-center"
        v-text="`reset`"
      />
    </div>
    <div 
      class="absolute w-full bottom-32 left-0 grid place-items-center"
      :class="`${ redirecting ? 'bottom-32' : '-bottom-32' }`"
    >
      <div
        class="sm:text-4xl text-3xl transition-opacity duration-300 text-center p-4 ring-1 ring-accent dark:bg-highlight-dark bg-highlight-light rounded-lg"
        :class="`${ redirecting ? 'opacity-100' : 'opacity-0' }`"
      >
        <p class="font-semibold italic text-accent " v-text="`workout saved!`"/>
        <p class="font-bold" v-text="`redirecting...`"/>
      </div>
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
    transition: transform 0.5s ease, opacity 0.5s ease;
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
    @apply absolute w-[95%] max-w-[608px] grayscale;
  }
</style>
