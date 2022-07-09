<script setup lang="ts">
   import { InputState } from '@/types';
   import { onMounted, ref } from 'vue';
   interface FormFieldProps {
      name: string;
      type: 'number' | 'string' | 'password';
      content?: number | string;
      required?: boolean;
      focus?: boolean;
      state?: InputState;
   }
   const { name, required, focus, type, state } = defineProps<FormFieldProps>();
   const emit = defineEmits(['update:content']);
   const inputEl = ref<HTMLInputElement>();
   const focused = ref<boolean>(focus ? true : false);

   const decrement = () => {
      if (inputEl.value) {
         let n = Number.parseFloat(inputEl.value.value);
         if (Number.isNaN(n)) {
            emit('update:content', (1).toString());
         } else {
            let newN = n - 1;
            if (newN > 0) {
               emit('update:content', newN.toString());
            }
         }
      }
   };

   const increment = () => {
      if (inputEl.value) {
         let n = Number.parseFloat(inputEl.value.value);
         if (Number.isNaN(n)) {
            emit('update:content', (1).toString());
         } else {
            emit('update:content', (n + 1).toString());
         }
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
            state === undefined || state === 'unfilled'
               ? 'hsla(var(--highlight-dark, .75)' // if undifined or 'unfilled'
               : state === 'completed'
               ? 'hsla(var(--accent1-dark), .75)' // if completed or valid
               : 'hsla(var(--error-dark), .75)', // if has error
         backgroundColor: focused ? 'hsla(var(--white), 0.025)' : 'transparent',
      }"
   >
      <input
         class="field-input"
         ref="inputEl"
         :placeholder="name"
         :required="required"
         :name="name"
         :type="type"
         autocomplete="off"
         :value="content"
         :style="{
            width: type === 'number' ? '35%' : '100%',
         }"
         @input="$emit('update:content', ($event.target as HTMLTextAreaElement).value)"
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
      font-size: var(--xl2);

      padding: var(--sx) var(--sm);
      background: transparent;
      border: 0;
      outline: 0;
   }

   .field-input::placeholder {
      color: hsla(var(--txt-dark), 1);
      opacity: 0.2;
      font-style: italic;
      padding-left: var(--sx);
   }
   .crements {
      width: 60%;
      justify-self: end;
      justify-content: end;
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
