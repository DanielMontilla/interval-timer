<script setup lang="ts">
  import { InputData, InputState, InputValidator } from '@/types';
  import { computed, ref, toRef, watch } from 'vue';

  interface InputProps {
    data: InputData,
    validators?: InputValidator[]
    label?: string
  }

  interface InputEmits {
    (e: 'update:data', data: InputData): void
  }

  const { data, validators, label } = defineProps<InputProps>();
  const _label = label ? label : '';
  const _type = typeof data.content == 'number' ? 'number' : 'text';

  const emit = defineEmits<InputEmits>();
  const msgs = ref<string[]>([]);
  const focused = ref<boolean>(false);
  const empty = ref<boolean>(data.content.toString().length <= 0);

  const update = (e: Event | string) => {
    let content: string;
    if (typeof e === 'string') {
      content = e;
    } else {
      let el = e.target as HTMLInputElement;
      content = el.value;
    }

    let state: InputState = 'valid';
    msgs.value.splice(0, msgs.value.length);
    if (validators) {
      for (const validator of validators) {
        let { isValid, msg }= validator(content);
        if (!isValid) {
          state = 'invalid';
          msgs.value.push(msg);
        }
      }
    }

    emit('update:data', { state, content });
    empty.value = content.trim().length <= 0;
  }
</script>

<template>
  <div class="input-field" :class="[{'in-focus': focused || !empty}]">
    <div v-text="_label" class="label" />
    <input
      :value="data.content"
      :type="_type"
      autocorrect="false"
      @input="update"
      @focusin="focused = true"
      @focusout="focused = false"
    />
  </div>
</template>

<style scoped>
  .input-field {
    @apply
      w-full flex items-end relative rounded-md px-2
      /* dark:bg-white/10 */
  }

  .label {
    @apply
      absolute opacity-50 top-[35%] leading-none transition-all ease-in
  }

  .in-focus .label {
    @apply
      top-0 text-base font-bold
  }

  input {
    @apply
      w-full pt-5 outline-none h-4/5 z-10 py-2
      bg-transparent border-b-2 
  }
</style>
