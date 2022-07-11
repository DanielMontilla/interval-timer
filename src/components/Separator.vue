<script setup lang="ts">
   interface SeparatorProps {
      text: string;
      size?: string;
   }

   const { text } = defineProps<SeparatorProps>();
</script>

<template>
   <div class="separator d-flex">
      <div class="separator-line" :style="{ width: '20%' }" />
      <div class="separator-text" :style="{ fontSize: size ? size : 'var(--xl)' }">
         {{ text }}
      </div>
      <div class="separator-line" />
   </div>
</template>

<style scoped>
   .separator {
      width: 100%;
      justify-content: start;
   }
   .separator > * + * {
      margin-left: var(--sm);
   }

   .separator-line {
      width: 100%;
      display: inline-block;
      height: var(--sx);
      background-color: hsla(var(--accent1-dark), 1);
      border-radius: var(--md);
   }

   .separator-text {
      font-weight: bold;
      width: max-content;
      white-space: nowrap;
   }
</style>
