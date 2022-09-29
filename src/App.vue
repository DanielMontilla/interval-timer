<script setup lang="ts">
  import useTheme from '@/services/theme';
  import { onMounted } from 'vue';

  const { changeTheme } = useTheme();

  onMounted(() => {
    changeTheme('dark');
  })

</script>

<template>
  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"/>
      </transition>
    </router-view>
  </main>
</template>

<style lang="scss" scoped>
  main {
    @apply 
      w-screen h-screen
      transition-colors
      dark:bg-slate-700
      dark:text-white
      select-none
    ;

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
