<script setup lang="ts">
   import { InputData, InputState, InputValidation } from '@/types';
   import { ref } from 'vue';

   /* 🎈 props & defaults */
   const { data, label, placeholder, icon, validate, prevent } = defineProps<{
      data: InputData<string | number>;
      label?: string;
      placeholder?: string;
      icon?: { src?: string; position?: 'left' | 'right' };
      prevent?: (value: string) => boolean;
      validate?: InputValidation;
   }>();
   const emit = defineEmits<{
      (event: 'update:data', data: InputData): void;
   }>();

   /* 📷 local state */
   const inputEl = ref<HTMLInputElement | null>();

   /* 🔧 utility */
   const update = (e: Event) => {
      let value = (e.target as HTMLInputElement).value;
      let state: InputState = 'unfilled';
      let msgs: string[] | undefined;

      if (prevent) {
         if (prevent(value)) value = value.slice(0, value.length - 1);
      }

      if (validate) {
         let { state: s, msgs: m } = validate(value);
         state = s;
         msgs = m;
      }

      emit('update:data', { value, state, msgs });
   };

   const iconStyle = (): 'left' | 'less' | 'right' => {
      if (icon) {
         if (icon.position) return icon.position;
         return 'right';
      } else {
         return 'less';
      }
   };

   /* 📅 event handlers */
   const focus = () => {
      if (inputEl.value) inputEl.value.focus();
   };
</script>

<template>
   <div
      class="input"
      :class="[`${data.state}-state`, `${iconStyle()}-icon`]"
      @click="focus"
   >
      <!-- <label class="label" for="input" v-text="label" /> -->
      <input
         ref="inputEl"
         id="input"
         :placeholder="placeholder"
         :value="data.value"
         @input="update"
      />
      <img v-if="icon" :src="icon.src ? icon.src : 'icons/edit.svg'" />
   </div>
</template>

<style scoped>
   .input {
      position: relative;
      min-height: var(--s-base);
      background-color: var(--c-fg);
      --rad: var(--s-md);
      border-radius: var(--rad);
      border-bottom: 4px solid;
      transition: border-color 0.2s linear;
      padding: var(--s-base);
      line-height: 0.6;

      display: grid;
      align-items: center;
   }

   .right-icon {
      grid-template-columns: auto auto;
      grid-template-rows: min-content;
      grid-template-areas: 'input icon';
   }

   .less-icon {
      grid-template-columns: auto;
      grid-template-rows: min-content;
      grid-template-areas: 'input';
   }

   .left-icon {
      grid-template-columns: auto auto;
      grid-template-rows: min-content;
      grid-template-areas: 'icon input';
   }

   .unfilled-state {
      border-color: var(--c-t-primary);
   }

   .completed-state {
      border-color: var(--c-succ);
   }

   .error-state {
      border-color: var(--c-error);
   }

   .input input {
      grid-area: input;
      border: none;
      background-color: transparent;
      color: var(--c-t-primary);
      display: block;
      width: 100%;
   }

   .input input:focus {
      outline: none;
   }

   .input img {
      grid-area: icon;
      justify-self: center;
      max-height: 80%;
      max-width: 80%;
      filter: var(--f-primary);
   }

   .label {
      position: absolute;
      inset: 0;
      width: min-content;
      height: min-content;
      line-height: 0.6;
      padding: var(--s-lg) var(--s-md);
   }
</style>
