<script setup lang="ts">
  import { Input } from '@/components/_index';
  import { ref } from 'vue';

  const name = ref('dude');
  const nameGet = () => name;
</script>

<template>
  <div class="create-page">
    <div>
      {{ name }}
    </div>
    <Input :value="nameGet()" />
   </div>
</template>

<style scoped>
</style>
