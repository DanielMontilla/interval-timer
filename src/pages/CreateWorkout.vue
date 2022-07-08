<script setup lang="ts">
   import { ReturnBtn, FormField } from '@/components/_index';
</script>

<template>
   <div class="create-workout d-grid">
      <ReturnBtn :back-path="'/select'" class="rtn-btn" />
      <div class="title t-title">New workout</div>
      <div class="form d-flex">
         <FormField name="name" class="frm-field" />
         <FormField name="reps" class="frm-field" />
      </div>
   </div>
</template>

<style scoped>
   .create-workout {
      width: 100vw;
      justify-content: stretch;
      grid-template-columns: min-content auto;
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
      margin: var(--sm);
      grid-area: return;
   }
   .form {
      width: 100vw;
      grid-area: form;
      padding-right: var(--sm);
      padding-left: var(--sm);

      flex-direction: column;
   }

   .frm-field {
      width: 100%;
   }
</style>
