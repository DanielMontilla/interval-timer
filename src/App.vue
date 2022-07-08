<script setup lang="ts">
   import { onMounted, ref } from 'vue';
   import { useRouter } from '@/services/_index';
   import { Home, Select, CreateWorkout } from '@/pages/_index';

   // Services 🔌
   const { initRoutes, currentPage, currentPath, goTo } = useRouter();

   // State 📷
   const loading = ref(true);

   onMounted(async () => {
      initRoutes({
         '/home': Home,
         '/select': Select,
         '/new-workout': CreateWorkout,
      });

      await goTo('/select');
      loading.value = false;
   });
</script>

<template>
   <main>
      <transition name="fade" mode="out-in">
         <div :key="currentPath">
            <component :is="currentPage" />
         </div>
      </transition>
   </main>
</template>

<style>
   @import '@/styles/base.css';
   main {
      height: 100%;
      width: 100%;
   }

   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.05s linear;
      /* transition: transform 0.05s linear; */
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
      /* transform: translate(-50px); */
   }
</style>
