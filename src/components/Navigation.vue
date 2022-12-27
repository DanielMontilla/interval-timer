<script setup lang="ts">
  import { useRouter } from '@/services/_index'
  import { watch } from 'vue';
  const { goToNamed, routes, currentRoute } = useRouter();

</script>

<template>
  <div class="navegation-bar">
    <div v-for="{ name } in routes" @click="goToNamed(name)"
      class="flex flex-col h-full justify-evenly"
      :class="{'text-accent underline decoration-2': currentRoute === name}"
    >
      <inline-svg :src="`icons/${name}.svg`" class="mb-1" />
      <div v-text="name" class="leading-none text-center font-bold text-text-light dark:text-text-dark"/>
    </div>
  </div>
</template>

<style scoped>
  .navegation-bar {
    @apply
      absolute w-full bottom-0 backdrop-blur-sm backdrop-opacity-75 h-16 pt-1 z-10
      grid grid-cols-4 content-center
      transition-colors duration-75
      bg-highlight-light
      dark:bg-highlight-dark
      sm:bottom-5 sm:rounded-b-xl
      max-w-[640px]
  }

  svg {
    @apply
      aspect-square h-8
      transition-[fill] duration-75
  }
</style>
