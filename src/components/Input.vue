<script setup lang="ts">
  import { Ref } from 'vue';

  interface InputProps<T = number | string> { value: Ref<T>, validate?: (n: T) => boolean }

  const { value, validate } = defineProps<InputProps>();

  const update = (n: number | string) => {
    value.value = n;
  }
</script>

<template>
  <div class="input-field">
    <input
      :value="value.value"
      @input="update(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
</style>
