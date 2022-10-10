<script setup lang="ts">
  import { InputData, InputState, InputValidator, InputType } from '@/types';
  import { ref } from 'vue';

  interface InputProps<T extends InputType> {
    data: InputData<T>,
    validators?: InputValidator[]
    label?: string
  }

  interface InputEmits {
    <T extends InputType>(e: 'update:data', data: InputData<T>): void
  }

  const { data, validators, label } = defineProps<InputProps<InputType>>();
  const _label = label ? label : '';
  const _type = typeof data.content == 'number' ? 'number' : 'text';

  const emit = defineEmits<InputEmits>();
  const msgs = ref<string[]>([]);
  const focused = ref<boolean>(false);
  const empty = ref<boolean>(data.content ? data.content.toString().length <= 0 : true);
  const inputEl = ref<HTMLInputElement>();
  
  const focus = () => {
    if (!inputEl.value) return;
    inputEl.value.focus();
  }

  const validate = () => {
    console.log('works');
  }

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

  defineExpose({ validate })
</script>

<template>
  <div class="input-container" :class="[{'in-focus': focused || !empty}]" @click="focus">
    <div class="input-field" :class="{'is-valid': data.state == 'valid', 'is-invalid': data.state == 'invalid'}">
      <div v-text="_label" class="label" />
      <input
        ref="inputEl"
        :value="data.content"
        :type="_type"
        autocorrect="false"
        @input="update"
        @focusin="focused = true"
        @focusout="focused = false"
      />
    </div>
    <Transition>
      <div v-if="msgs[0]" class="msg" v-text="msgs[0]" />
    </Transition>
  </div>
</template>

<style scoped>
  .input-container {
    @apply 
      relative pb-5
  }
    
  .input-field {
    @apply
      w-full rounded-md pt-4 relative px-2 border-b-[3px]
      bg-white/10 border-b-black
      dark:bg-white/5 dark:border-b-white
  }

  .is-valid {
    @apply
      border-green-500
      dark:border-green-500
  }

  .is-invalid {
    @apply
      border-red-700
      dark:border-red-700
  }

  .msg {
    @apply
      absolute right-2 bottom-0 text-right text-base whitespace-nowrap
      text-red-700
      dark:text-red-600
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
      w-full outline-none h-4/5 z-10 py-2
      bg-transparent
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.4s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
