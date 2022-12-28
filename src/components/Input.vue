<script setup lang="ts">
  import { InputData, InputState } from '@/types';
import { validateInputData } from '@/util';
  import { ZodSchema } from 'zod';

  interface InputProps {
    label: string, data: InputData, isNumber?: boolean
    inputClass?: string, labelClass?: string,
    schema: ZodSchema
  }
  interface InputEmits { (e: 'update:data', data: InputData): void }

  const { label, data, schema, isNumber } = defineProps<InputProps>();
  const emit = defineEmits<InputEmits>()

  const udpate = ({ target }: Event) => {
    if (!(target instanceof HTMLInputElement)) return;

    const content = target.value;
    const data = validateInputData(content, schema, isNumber);
    
    emit('update:data', data);
  }

</script>

<template>
  <div class="flex flex-col w-full text-xl">
    <div class="flex flex-row w-full justify-between leading-tight items-end">
      <label v-text="label" :class="labelClass" class="font-bold ml-1" />
      <transition name="msg">
        <div v-if="data.msg" v-text="data.msg" class="italic font-semibold text-base mr-1 text-red-800" />
      </transition>
    </div>
    <input
      :type="isNumber ? 'number' : 'string'"
      :value="data.content"
      @input="udpate"
      class="input-el col-span-2 row-start-2 row-end-2 appearance-none dark:bg-highlight-dark bg-highlight-light outline-none border-b-2 px-4 py-3 rounded-md"
      :class="[
        inputClass, 
        { 'border-neutral': data.state === 'empty' },
        { 'border-accent': data.state === 'valid' },
        { 'border-red-800': data.state === 'invalid' },
      ]"
    />
  </div>
</template>

<style scoped>

  .input-el {
    transition: border-color 0.15s linear;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .msg-enter-active,
  .msg-leave-active {
    transition: opacity 0.15s linear;
  }

  .msg-enter-from,
  .msg-leave-to {
    opacity: 0;
  }
</style>
