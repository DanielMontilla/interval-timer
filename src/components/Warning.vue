<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core';
  import { computed, ref } from 'vue';

  const { width } = useWindowSize();

  const onMobile = computed(() => width.value <= 768);
  const ignoreDevice = ref<boolean>(false);
  const showWarning = computed(() => !onMobile.value && !ignoreDevice.value);
</script>

<template>
  <div v-if="showWarning" class="device-warning">
    <svg>
      <use href="icons/!.svg"></use>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
   .device-warning {
      @apply
        absolute w-screen h-screen flex
      ;
      svg { 
        @apply fill-current aspect-square w-4;
      }
   }
</style>
