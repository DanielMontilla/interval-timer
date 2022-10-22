<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { InputData, Exercise, Action, InputEl } from '@/types';
  import { lessThan, lessThanNumeric, moreThanNumeric, notEmpty, isNumber, getDefExercise, isInt, ACTIONS, isInputEl } from '@/util';
  import { ComponentPublicInstance, onBeforeUpdate, ref } from 'vue';

  const name = ref<InputData<string>>({});
  const reps = ref<InputData<number>>({});

  let _next = 0; // must have unique id for each exercise to mantain state between input components
  const exercises = ref<{id: number, exercise: Exercise}[]>([{id: _next++, exercise: getDefExercise()}]);

  let _inputeEls: InputEl[] = [];
  let _addInputEl = (el: Element | null | ComponentPublicInstance) => {
    if (el == null) return;
    isInputEl(el) ? _inputeEls.push(el) : null;
  }

  const add = (at: number, exercise: Exercise = getDefExercise()) => exercises.value.splice(at, 0, { id: _next++, exercise: exercise });

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

    let eCopy: Exercise = Object.create(exercises.value[position].exercise);

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

  const submit = () => {
    const fail = () => {
      _inputeEls.forEach( i => i.state != 'valid' ? i.validate() : null);
      return false;
    }

    const succ = () => {
      console.log('succeccscc');
      return true;
    }

    if (name.value.state != 'valid') return fail();
    if (reps.value.state != 'valid') return fail();

    for (const { exercise } of exercises.value) {
      let { state: nState } = exercise.name;
      let { state: dState } = exercise.duration;

      if (nState != 'valid' || dState != 'valid') return fail();
    }

    succ();
  }

  const clear = () => {
    console.log(_inputeEls);
  }

  // NOTE: every time the dom is updated, the `:ref="..."` are ran again! this is super inefficient bc it runs on every input
  onBeforeUpdate(() => _inputeEls = []);
  
</script>

<template>
  <div class="create-page">
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

    <!-- <TransitionGroup> TODO: add cool animations! -->
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
          <!-- TODO: maybe figure out how to add cool animations to list... ? -->
          <div v-for="action in ACTIONS" class="action-btn" @click="handleAction(action, i)">
            <inline-svg :src="`icons/${action}.svg`" />
          </div>
        </div>
      </div>
    <!-- </TransitionGroup> -->
    <div class="w-full border-b-2 border-black/10 dark:border-white/10 mb-4"/> <!-- separator! -->
    <div class="flex w-full justify-evenly">
      <div class="btn save-btn" v-text="`save`" @click="submit"/>
      <div class="btn clear-btn" v-text="`clear`" @click="clear"/>
    </div>
    <div v-if="true">

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
      text-3xl font-bold py-4 pt-3 px-5 rounded-md leading-none min-w-[100px]
      text-white text-center
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

</style>
