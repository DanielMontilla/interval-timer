<script setup lang="ts">
   import { useRouter } from '@/services/_index';
   interface FormFieldProps {
      name: string;
      required?: boolean;
   }
   const { name, required } = defineProps<FormFieldProps>();
</script>

<template>
   <input class="field-input" :placeholder="name" :required="required" :name="name" />
   <label class="field-label" :for="name">{{ name }}</label>
</template>

<style scoped>
   .field-input {
      color: hsla(var(--txt-dark), 1);
      font-size: var(--xl2);

      background: transparent;
      padding: var(--sx) 0;
      border: 0;
      border-bottom: 2px solid hsla(var(--highlight-dark), 1);
      outline: 0;

      transition: border-color 0.2s;
   }

   .field-label {
      position: absolute;
      top: 0;
      left: var(--sm);
      display: block;
      transition: 0.2s;
      font-size: var(--base);
      color: hsla(var(--txt-dark), 0.8);
   }

   .form-field::placeholder {
      color: transparent;
   }
</style>
