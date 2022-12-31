<script setup lang="ts">
  import { useRouter } from '@/services/_index'
  const { goToNamed, routes, currentRoute } = useRouter();

</script>

<template>
  <div class="navegation-bar">
    <div v-for="_, i in Array(4)" @click="goToNamed(routes[i].name as string)"
      class="flex flex-col h-full justify-evenly"
      :class="{'text-accent underline decoration-2': currentRoute === routes[i].name}"
    >
      <inline-svg :src="`icons/${routes[i].name}.svg`" class="mb-1" />
      <div v-text="routes[i].name" class="leading-none text-center font-bold text-text-light dark:text-text-dark"/>
    </div>
  </div>
</template>

<style scoped>
  .navegation-bar {
    @apply
      absolute w-full bottom-0 h-16 pt-1 z-10
      grid grid-cols-4 content-center
      transition-colors duration-75
      bg-highlight-light
      dark:bg-highlight-dark
      sm:bottom-5 sm:rounded-b-xl
      max-w-[640px]
    ;

    filter: drop-shadow(0px 0px 7px rgba(0, 0, 0, 0.5));
  }

  svg {
    @apply
      aspect-square h-8
      transition-[fill] duration-75
  }
</style>
