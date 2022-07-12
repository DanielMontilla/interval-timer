<script setup lang="ts">
   import { onMounted, ref } from 'vue';
   import { useRouter } from '@/services/_index';
   import { Home, Select, CreateWorkout, Workout } from '@/pages/_index';

   // Services 🔌
   const { initRoutes, currentPage, currentPath, goTo } = useRouter();

   // State 📷
   const loading = ref(true);

   onMounted(async () => {
      initRoutes({
         '/home': Home,
         '/select': Select,
         '/new-workout': CreateWorkout,
         '/workout': Workout,
      });

      await goTo('/select');
      loading.value = false;
   });
</script>

<template>
   <main class="max-width">
      <transition name="fade" mode="out-in">
         <div :key="currentPath">
            <component :is="currentPage" />
         </div>
      </transition>
   </main>
</template>

<style>
   @import '@/styles/base.css';

   .fade-enter-active,
   .fade-leave-active {
      transition: opacity 0.05s linear;
   }

   .fade-enter-from,
   .fade-leave-to {
      opacity: 0;
   }
</style>
