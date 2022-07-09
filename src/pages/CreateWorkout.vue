<script setup lang="ts">
   import { ReturnBtn, FormField } from '@/components/_index';
   import { Exercise, InputState } from '@/types';
   import { onMounted, ref, watch } from 'vue';

   const name = ref<string>('');
   const nameState = ref<InputState>();
   const reps = ref<string>('');
   const repsState = ref<InputState>();
   const exercises = ref<Exercise[]>([]);

   // Input fields validation !
   watch(name, n => {
      if (n === '' || n.length > 4) {
         nameState.value = 'error';
      } else {
         nameState.value = 'completed';
      }
   });

   watch(reps, r => {
      if (r) {
         let n = Number.parseFloat(r);
         if (Number.isNaN(n) || n < 1 || n % 1 !== 0) {
            repsState.value = 'error';
         } else {
            repsState.value = 'completed';
         }
      }
      if (r === '') repsState.value = 'error';
   });
</script>

<template>
   <div class="create-workout d-grid">
      <ReturnBtn :back-path="'/select'" class="rtn-btn" />
      <div class="title t-title">New workout</div>
      <div class="form d-flex">
         <FormField
            name="name"
            class="form-field"
            v-model:content="name"
            type="string"
            :focus="true"
            :state="nameState"
         />
         <FormField
            name="reps"
            class="form-field"
            v-model:content="reps"
            type="number"
            :state="repsState"
         />
         <div class="exercises d-flex">
            <div v-for="exercise in exercises" class="exercise"></div>
            <div class="add-exercise"></div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   .create-workout {
      width: 100vw;
      justify-content: stretch;
      grid-template-columns: calc(var(--xl) + 2 * var(--md)) max-content;
      grid-template-rows: auto auto auto;
      grid-template-areas:
         'return title'
         'form form'
         'submit submit';
   }

   .title {
      grid-area: title;
      justify-self: start;
   }

   .rtn-btn {
      margin: var(--md);
      grid-area: return;
   }
   .form {
      width: 100vw;
      grid-area: form;
      padding-right: var(--sm);
      padding-left: var(--sm);

      flex-direction: column;
   }
   .form > * + * {
      margin-top: var(--md);
   }

   .form-field {
      width: 100%;
   }
</style>
