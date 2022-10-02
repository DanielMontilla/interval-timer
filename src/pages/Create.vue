<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { InputData } from '@/types';
  import { lessThan, moreThan, moreThanNumeric, notEmpty, isNumber, isInt } from '@/util';
  import { ref } from 'vue';

  const name = ref<InputData>({ content: '' });
  const reps = ref<InputData>({ content: 1 });
</script>

<template>
  <div class="create-page">
    <Input 
      class="text-3xl"
      v-model:data="name" 
      label="workout name" 
      :validators="[notEmpty, moreThan(3), lessThan(10)]"
    />
    <Input 
      class="text-3xl"
      v-model:data="reps" 
      label="reps" 
      :validators="[notEmpty, moreThanNumeric(0), isNumber, isInt]"
    />

  </div>
</template>

<style scoped>
  .create-page * + * {
    @apply
      mt-4
  }
</style>
