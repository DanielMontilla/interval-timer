<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useTheme, useRouter, useState } from '@/services/_index';
  import { Navigation } from '@/components/_index'

  const { toggleTheme, theme, changeTheme } = useTheme();
  const { init } = useState();
  const { goToNamed, currentRoute } = useRouter();

  onMounted(() => {
    changeTheme('dark');
    if (currentRoute.value !== 'home') goToNamed('home');
    init();
  })

</script>

<template>
  <main>
    <div
      class="absolute top-0 right-0 text-2xl z-20 h-8 aspect-square invisible sm:visible"
      v-text="theme == 'light' ? `🌑` : `🌕`"
      @click="toggleTheme"
    />
    <router-view v-slot="{ Component }">
      <div class="screen">
        <Transition name="fade" mode="out-in">
          <KeepAlive :max="0">
            <component :is="Component" class="page"/>
          </KeepAlive>
        </Transition>
        <Navigation/>
      </div>
    </router-view>
  </main>
</template>

<style scoped>
  main {
    @apply 
      w-screen h-screen select-none overflow-hidden overflow-y-hidden fixed
      grid place-content-center
      transition-colors
      bg-void-light text-text-light
      dark:bg-void-dark dark:text-text-dark
  }

  .screen {
    @apply 
      max-w-[640px] w-screen
      overflow-x-auto scrollbar-hide
      transition-colors
      bg-background-light
      dark:bg-background-dark
      sm:my-5 sm:rounded-xl
  }

  .page {
    @apply min-h-screen sm:min-h-[calc(100vh-40px)]
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.1s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
