<script setup lang="ts">
   import { useRouter } from '@/services/_index';
   interface ReturnBtnProps {
      backPath: string;
   }
   const { backPath } = defineProps<ReturnBtnProps>();
   const { goTo } = useRouter();
</script>

<template>
   <div class="div"></div>
   <div class="return-btn" @click="goTo(backPath)">
      <img src="@/assets/icons/return-arrow.svg" />
   </div>
</template>

<style>
   .return-btn {
      position: absolute;
      top: var(--sm);
      left: var(--sm);

      --size: 32px;

      height: var(--size);
      width: var(--size);

      /* Flex 💪 */
      display: flex;
      align-items: center;
      justify-content: center;
   }

   .return-btn img {
      --size: 60%;
      filter: var(--white);
      height: var(--size);
      width: var(--size);
   }
</style>
