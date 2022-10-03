<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { InputData } from '@/types';
  import { lessThan, lessThanNumeric, moreThanNumeric, notEmpty, isNumber, isInt } from '@/util';
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
      :validators="[notEmpty, lessThan(50)]"
    />
    <Input 
      class="text-3xl"
      v-model:data="reps" 
      label="reps" 
      :validators="[isNumber, moreThanNumeric(0), lessThanNumeric(1001), isInt]"
    />

    <div class="w-full border-b-2 border-white"/>

  </div>
</template>

<style scoped>
  .create-page .input-continer + .input-continer {
    @apply
      mt-2
  }
</style>
