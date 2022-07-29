<script setup lang="ts">
   import { useState, useInit, useRouter } from '@/services/_index';
   import { onMounted, ref, watch } from 'vue';
   import { SetBackRoute } from '@/types';
   import { delay } from './util';

   /* 🔌 services */
   const { init, initializing } = useInit();
   const { theme, toggleTheme, pageTitle, mainEl } = useState();
   const { currentPage, goTo } = useRouter();

   /* 📷 local state */
   const backRoute = ref<string | null>(null);
   let fisrt = true;

   /* 🔧 utility */
   const hideBar = async () => {
      if (mainEl.value) {
         if (fisrt) {
            // First instance
            mainEl.value.scrollTo(0, 64);
            mainEl.value.style.scrollBehavior = 'smooth';
            fisrt = false;
         } else {
            // subsquente instances
            if (mainEl.value.scrollTop < 64) {
               console.log('yo');
               await delay(500);
               mainEl.value.scrollTo(0, 64);
            }
         }
      }
   };
   const setBackRoute: SetBackRoute = (route: string | null) => {
      backRoute.value = route;
   };

   /* 🏁 initialization */
   init();
   onMounted(() => {
      watch(mainEl, hideBar);
   });
</script>

<template>
   <main ref="mainEl" v-if="!initializing" class="fill" :class="[`${theme}-theme`]">
      <div class="app-bar">
         <div
            v-if="backRoute !== null"
            class="return"
            @click="[goTo(backRoute as string), hideBar()]"
         ></div>
         <div class="title" v-text="pageTitle" />
         <div class="theme-toggle" @click="toggleTheme"></div>
      </div>
      <component
         class="page"
         :is="currentPage"
         @set-back-route="setBackRoute"
         @hide-bar="hideBar"
      />
   </main>
</template>

<style>
   @import '@/styles/base.css';

   #app {
      height: 100%;
      width: 100%;

      display: flex;
      justify-content: center;

      font-family: 'Nunito';
      font-size: var(--base);

      user-select: none;
      overflow-x: hidden;
   }

   /* 🎨 global heme variables */
   main.light-theme {
      --c-t-primary: var(--c-t-light);
      --c-bg-primary: var(--c-bg-light);
      --c-accent: var(--c-accent-light);
      --f-primary: var(--f-black);
      --c-fg: var(--c-fg-light);
      --c-succ: var(--c-succ-light);
      --c-error: var(--c-error-light);
   }

   main.dark-theme {
      --c-t-primary: var(--c-t-dark);
      --c-bg-primary: var(--c-bg-dark);
      --c-accent: var(--c-accent-dark);
      --f-primary: var(--f-white);
      --c-fg: var(--c-fg-dark);
      --c-succ: var(--c-succ-dark);
      --c-error: var(--c-error-dark);
   }

   main {
      position: relative;
      color: var(--c-t-primary);
      background-color: var(--c-bg-primary);

      display: grid;
      justify-content: center;
      grid-template-columns: minmax(320px, 640px);
      grid-template-rows: 64px auto;
      grid-template-areas: 'app-bar' 'page';

      overflow-y: auto;
      scroll-behavior: auto;
   }

   .page {
      grid-area: page;
      max-width: 640px;
      min-width: 320px;
      width: 100%;
      min-height: 100vh;
      position: relative;
   }

   .app-bar {
      background-color: var(--c-fg);
      grid-area: app-bar;
      height: 100%;
      width: 100%;
      padding: 0 var(--s-sm);
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
      overflow: hidden;
      flex-shrink: 0;
   }

   .app-bar .return {
      min-height: 48px;
      min-width: 48px;
      border-radius: 50%;
      background-color: lightblue;
   }

   .app-bar .title {
      font-size: var(--s-xl);
      font-weight: bold;
      text-decoration: underline;
      text-decoration-thickness: 4px;
      text-decoration-color: var(--c-accent);
      white-space: nowrap;
   }

   .app-bar .theme-toggle {
      min-height: 48px;
      min-width: 48px;
      border-radius: 50%;
      background-color: lightblue;
   }
</style>
