<script setup lang="ts">
  import { useRouter } from '@/services/_index'
  const { goToNamed, routes } = useRouter();

</script>

<template>
  <div class="navegation-bar">
    <div v-for="{ name } in routes" @click="goToNamed(name)">
      <div class="flex flex-col gap-1">
        <inline-svg :src="`icons/${name}.svg`" />
        <div v-text="name" class="leading-none text-center font-bold"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .navegation-bar {
    @apply
      sticky w-full bottom-0 backdrop-blur-sm backdrop-opacity-75 h-16 pt-1 z-10
      flex justify-around items-center
      transition-colors duration-75
      bg-white/30
      dark:bg-black/20
  }

  svg {
    @apply
      aspect-square h-8
      fill-gray-800
      dark:fill-white
  }
</style>
