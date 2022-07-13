<script setup lang="ts">
   import { InputState } from '@/types';
   import { onMounted, ref, toRef, watch } from 'vue';
   interface FormFieldProps {
      name: string;
      type: 'number' | 'string' | 'password';
      content: [number | string, InputState];
      required?: boolean;
      focus?: boolean;
      validation?: (value: string) => InputState;
   }
   const { name, required, focus, type, validation, content } =
      defineProps<FormFieldProps>();
   const emit = defineEmits(['update:content']);
   const inputEl = ref<HTMLInputElement>();
   const focused = ref<boolean>(focus ? true : false);

   const validate = (s: string) => {
      emit('update:content', [s, validation ? validation(s) : 'unfiled']);
   };

   const decrement = () => {
      if (inputEl.value) {
         let n = Number.parseFloat(inputEl.value.value);
         let v = 1;
         if (!Number.isNaN(n)) {
            if (n - 1 > 0) {
               v = n - 1;
            }
         }
         let r = v.toString();
         emit('update:content', r);
         validate(r);
      }
   };

   const increment = () => {
      if (inputEl.value) {
         let n = Number.parseFloat(inputEl.value.value);
         let v = 1;

         if (!Number.isNaN(n)) {
            v = n + 1;
         }

         let r = v.toString();
         emit('update:content', r);
         validate(r);
      }
   };

   onMounted(() => {
      if (focused.value) inputEl.value?.focus();
   });
</script>

<template>
   <div
      class="field-cont d-flex"
      :style="{
         borderColor:
            content[1] === undefined || content[1] === 'unfilled'
               ? 'hsla(var(--highlight-dark, 0.6)' // if undifined or 'unfilled'
               : content[1] === 'completed'
               ? 'hsla(var(--succ-dark), 0.5)' // if completed or valid
               : 'hsla(var(--error-dark), 0.5)', // if has error
         backgroundColor: focused ? 'hsla(var(--white), 0.025)' : 'transparent',
      }"
   >
      <input
         class="field-input"
         spellcheck="false"
         ref="inputEl"
         :placeholder="name"
         :required="required"
         :name="name"
         :type="type"
         autocomplete="off"
         :value="content[0]"
         :style="{
            width: type === 'number' ? '55%' : '100%',
         }"
         @input="[validate(($event.target as HTMLTextAreaElement).value)]"
         @focusin="focused = true"
         @focusout="focused = false"
      />

      <div v-if="type === 'number'" class="crements d-flex">
         <img class="de crement" src="@/assets/icons/minus.svg" @click="decrement" />
         <img class="in crement" src="@/assets/icons/plus.svg" @click="increment" />
      </div>
   </div>
</template>

<style scoped>
   .field-cont {
      border-bottom: 3px solid;
      border-radius: var(--sx);
      transition: all 0.2s;
      justify-content: start;
   }

   .field-input {
      display: inline;
      color: hsla(var(--txt-dark), 1);

      padding: var(--sx) var(--sm);
      background: transparent;
      border: 0;
      outline: 0;
   }

   input[type='number']::-webkit-inner-spin-button,
   input[type='number']::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
   }

   .field-input::placeholder {
      color: hsla(var(--txt-dark), 1);
      opacity: 0.2;
      font-style: italic;
      padding-left: var(--sx);
   }
   .crements {
      justify-self: end;
      justify-content: end;
      margin-right: 10%;
   }

   .crements > * + * {
      margin-left: var(--xl);
   }

   .crement {
      filter: var(--f-white);
      --size: var(--xl3);

      width: var(--size);
      height: var(--size);
   }
</style>
