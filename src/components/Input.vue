<script setup lang="ts">
  import { InputData, InputState, InputValidator, InputType } from '@/types';
  import { computed, onMounted, ref } from 'vue';

  interface InputProps<T extends InputType> {
    data: InputData<T>,
    validators?: InputValidator[]
    label?: string
  }

  interface InputEmits {
    <T extends InputType>(e: 'update:data', data: InputData<T>): void
  }

  const props = defineProps<InputProps<InputType>>();

  const content = computed(() => props.data.content);
  const state = computed(() => props.data.state);
  const validators = computed(() => props.validators);

  const _label = computed(() => props.label ? props.label : ''); // TODO: Change to computed prop value
  const _type = computed(() => typeof content.value == 'number' ? 'number' : 'text'); // TODO: Change to computed prop value

  const emit = defineEmits<InputEmits>();
  const msgs = ref<string[]>([]);
  const focused = ref<boolean>(false);
  const empty = computed(() => content.value ? content.value.toString().length <= 0 : true);
  const inputEl = ref<HTMLInputElement>();
  
  const focus = () => {
    if (!inputEl.value) return;
    inputEl.value.focus();
  }

  const validate = (e?: Event | string) => {
    let newContent: string;
    if (typeof e === 'string') {
      newContent = e;
    } else if (!e) {
      newContent = content.value ? `${content.value}` : '';
    } else {
      let el = e.target as HTMLInputElement;
      newContent = el.value;
    }

    let newState: InputState = 'valid';
    msgs.value.splice(0, msgs.value.length);
    if (validators.value) {
      for (const validator of validators.value) {
        let { isValid, msg }= validator(newContent);
        if (!isValid) {
          newState = 'invalid';
          msgs.value.push(msg);
        }
      }
    }

    emit('update:data', { state: newState, content: newContent });
  }

  defineExpose({ validate, state })
</script>

<template>
  <div class="input-container" :class="[{'in-focus': focused || !empty}]" @click="focus">
    <div class="input-field" :class="{'is-valid': state == 'valid', 'is-invalid': state == 'invalid'}">
      <div v-text="_label" class="label" />
      <input
        ref="inputEl"
        :value="data.content"
        :type="_type"
        autocorrect="false"
        @input="validate"
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
