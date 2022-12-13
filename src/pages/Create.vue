<script setup lang="ts">
  import { Input, Button } from '@/components/_index';
  import { useState } from '@/services/_index';
  import { InputData, Action, InputEl, InputExercise } from '@/types';
  import { lessThan, lessThanNumeric, moreThanNumeric, notEmpty, isNumber, getDefExercise, isInt, ACTIONS, isInputEl, waitMs } from '@/util';
  import { ComponentPublicInstance, onBeforeUpdate, ref } from 'vue';
  import { vOnClickOutside } from '@vueuse/components';

  const name = ref<InputData<string>>({});
  const reps = ref<InputData<number>>({});

  let _next = 0; // must have unique id for each exercise to mantain state between input components
  const exercises = ref<{id: number, exercise: InputExercise}[]>([{id: _next++, exercise: getDefExercise()}]);

  let _inputeEls: InputEl[] = [];
  let _addInputEl = (el: Element | null | ComponentPublicInstance) => {
    if (el == null) return;
    isInputEl(el) ? _inputeEls.push(el) : null;
  }

  const add = (at: number, exercise: InputExercise = getDefExercise()) => exercises.value.splice(at, 0, { id: _next++, exercise: exercise });

  const swap = async (i1: number, i2: number) => {
    const len = exercises.value.length - 1;
    
    // validating inputs:
    if (i1 < 0 || i2 < 0) return;
    if (i1 > len || i2 > len) return;
    if ( i1 == i2) return;
    
    const e1 = exercises.value[i1];
    const e2 = exercises.value[i2];
    
    exercises.value[i1] = e2;
  
    exercises.value[i2] = e1;
  }
  
  const remove = (position: number) => {
    const len = exercises.value.length - 1;
    
    // validating inputs:
    if (position > len || position < 0) return;
    if (len == 0) return;
    
    exercises.value.splice(position, 1);
  }
  
  const copy = (position: number) => {
    const len = exercises.value.length - 1;
    
    // validating inputs:
    if (position > len || position < 0) return;

    let eCopy: InputExercise = Object.create(exercises.value[position].exercise);

    add(position, eCopy);
  }

  const handleAction = (action: Action, position: number) => {
    switch (action) {
      case 'add':
        add(position + 1);
        break;
      case 'moveup':
        swap(position, position - 1);
        break;
      case 'movedown':
        swap(position, position + 1);
        break;
      case 'copy':
        copy(position);
        break;
      case 'delete':
        remove(position);
        break;
    }
  }
  
  const saving = ref<boolean>(false);
  const submit = async () => {
    
    let canSubmit = true;
    _inputeEls.forEach(i => {
      if (i.state != 'valid') {
        canSubmit = false;
        i.validate();
      }
    });
    
    if (!canSubmit) {
      // TODO: animations
      return false;
    }
    
    saving.value = true;
    const { addWorkout } = useState();
    
    await waitMs(100);
    saving.value = false;
    addWorkout({
      name: name.value.content as string,
      reps: reps.value.content as number,
      exercises: exercises.value.map(
        ({ exercise: { name, duration } }) => ({name: name.content as string, duration: duration.content as number})
      )
    }, { select: true, redirect: true })
      
    return true;
  }


  const allowedClear = ref(false);
  const disallow = () => allowedClear.value = false;
  const clear = () => {
    if (!allowedClear.value) {
      allowedClear.value = true;
      return;
    }
    allowedClear.value = false;
    _inputeEls.forEach(i => i.clear());
  };

  const reset = () => {
    
  }

  // NOTE: every time the dom is updated, the `:ref="..."` are ran again! this is super inefficient bc it runs on every input
  onBeforeUpdate(() => _inputeEls = []);
</script>

<template>
  <div class="create-page p-2">
    <Input :ref="_addInputEl"
      class="text-3xl"
      v-model:data="name" 
      label="workout name" 
      :validators="[notEmpty, lessThan(50)]"
    />
    <Input :ref="_addInputEl"
      class="text-3xl"
      v-model:data="reps" 
      label="reps" 
      :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(1001), isInt]"
    />

    <div class="w-full border-b-2 border-black/10 dark:border-white/10 mb-4"/> <!-- separator! -->

    <div v-for="({id, exercise}, i) in exercises" class="exercise-card" :key="id">
      <Input :ref="_addInputEl"
        class="text-xl"
        v-model:data="exercise.name"
        label="exercise name"
        :validators="[notEmpty, lessThan(24)]"
      />
      <Input :ref="_addInputEl"
        class="text-xl"
        v-model:data="exercise.duration"
        label="duration"
        :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(3600 + 1), isInt]"
      />
      <div class="actions">
        <div v-for="action in ACTIONS" class="action-btn" @click="handleAction(action, i)">
          <inline-svg :src="`icons/${action}.svg`" />
        </div>
      </div>
    </div>
    <div class="w-full border-b-2 border-black/10 dark:border-white/10 mb-4"/> <!-- separator! -->
    <div class="flex w-full justify-evenly">
      <Button class="btn save-btn"
        :on-click="submit"
        :clickable="!saving"
      >
        <inline-svg class="save-load-icon" v-if="saving" src="icons/spinner.svg"/>
        <div v-else v-text="`save`"/>
      </Button>
      <Button class="btn clear-btn" 
        :on-click="clear" 
        v-on-click-outside="disallow"
      >
        <Transition mode="out-in">
          <div v-if="allowedClear" v-text="`sure?`"/>
          <div v-else v-text="`clear`"/>
        </Transition>
      </Button>
    </div>
  </div>
</template>

<style scoped>
  .create-page .input-continer + .input-continer {
    @apply
      mt-2
  }
  .actions {
    @apply
      flex justify-end mb-5
  }

  .actions > .action-btn + .action-btn {
    @apply
      ml-3
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

  .btn {
    @apply
      text-3xl font-bold py-4 pt-3 px-5 rounded-md leading-none w-[112px] max-h-[54px]
      text-white flex content-center items-center justify-center place-content-center
  }

  .save-load-icon {
    @apply
      text-white aspect-square h-12 w-12 animate-spin mt-1;
  }

  .save-btn {
    @apply
      bg-green-700
      dark:bg-green-600
  }
  .clear-btn {
    @apply
      bg-rose-800
      dark:bg-rose-700
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.05s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

</style>
