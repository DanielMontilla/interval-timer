<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useTheme, useRouter, useState } from '@/services/_index';
  import { Navigation } from '@/components/_index'

  const { toggleTheme, theme, changeTheme } = useTheme();
  const { init } = useState();
  const router = useRouter();

  onMounted(() => {
    changeTheme('dark');
    router.push({name: 'create'})
    init();
  })

</script>

<template>
  <main>
    <div 
      class="absolute top-0 right-0 text-2xl z-10 h-8 aspect-square"
      v-text="theme == 'light' ? `🌑` : `🌕`"
      @click="toggleTheme"
    />
    <router-view v-slot="{ Component }">
      <div class="screen">
        <Transition name="fade">
          <KeepAlive :max="4">
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
      w-screen h-screen select-none overflow-hidden
      grid place-content-center
      transition-colors
      bg-void-light text-text-light
      dark:bg-void-dark dark:text-text-dark
  }

  .screen {
    @apply 
      max-w-3xl w-screen
      overflow-x-auto scrollbar-hide
      transition-colors
      bg-background-light md:drop-shadow-[0_28px_28px_rgba(0,0,0,0.4)]
      dark:bg-background-dark md:dark:drop-shadow-[0_18px_18px_rgba(128,128,128,0.1)]
  }

  .page {
    @apply
      min-h-screen p-2
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
