<script setup lang="ts">
   import { useRouter } from '@/services/_index';
   interface ReturnBtnProps {
      backPath: string;
   }
   const { backPath } = defineProps<ReturnBtnProps>();
   const { goTo } = useRouter();
</script>

<template>
   <div class="return-btn d-flex" @click="goTo(backPath)">
      <img src="@/assets/icons/return-arrow.svg" />
   </div>
</template>

<style>
   .return-btn {
      --size: var(--xl);

      height: var(--size);
      width: var(--size);
   }

   .return-btn img {
      --size: 60%;
      filter: var(--f-white);
      height: var(--size);
      width: var(--size);
   }
</style>
