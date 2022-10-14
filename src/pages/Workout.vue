<script setup lang="ts">
   import { ProgressWheel } from '@/components/_index';
   import { ref } from 'vue';

   const c = ref(49);

   const yo = () => {
      c.value += 1;
      console.log(c.value);
   }

</script>

<template>
   <div class="workout-page">
      <ProgressWheel :percentage="c" @click="yo"/>
   </div>
</template>

<style scoped>
   .workout-page {
      /* @apply */
         
   }
</style>
