<script setup lang="ts">
  import { Button } from '@/components/_index';
  import {useState, useRouter, useTheme} from '@/services/_index';
import { wait, waitS } from '@/util';
import { CSSProperties, onMounted, ref, StyleValue } from 'vue';

  const { theme, toggleTheme } = useTheme();
  const { workoutsExists, showNav, firstLoad } = useState();
  const { goToNamed } = useRouter();

  const titleAnim = ref(false);
  const authorAnim = ref(false);
  const buttonAnim = ref(false);
  const otherAnim = ref(false);

  const goDelayed = async () => {
    await wait(150);
    goToNamed(workoutsExists.value ? 'select' : 'create');
  }

  onMounted(async () => {
    titleAnim.value = true;
    await waitS(1.5);
    
    authorAnim.value = true;
    await waitS(1);
    
    buttonAnim.value = true;
    await waitS(1);

    otherAnim.value = true;
    showNav.value = true;
    await waitS(2.5);

    firstLoad.value = false;
  });
</script>

<template>
  <div class="flex flex-col justify-start p-3 relative">
    <div class="mt-8 flex flex-col items-center space-y-4">
      <div 
        class="w-full flex flex-col items-center"
        :class="[{'title-anim': firstLoad && titleAnim}, { 'invisible': !titleAnim }]"
      >
        <inline-svg :src="`text/welcome${workoutsExists ? '-back-to' : '-to'}.svg`" class="h-min inline-block self-start pl-[5%]" :class="`${workoutsExists ? 'w-1/2' : 'w-1/3'}`"/>
        <inline-svg :src="`text/interval-timer!.svg`" class="w-[90%] h-min inline-block mt-2"/>
      </div>
      <p 
        class="italic font-serif xm:text-2xl text-base text-start opacity-60 mt-1 self-start pl-[5%]" 
        :class="[{ 'author-anim': firstLoad && authorAnim }, { 'invisible': !authorAnim }]"
      >
        by <a v-text="`Daniel Montilla`" href="https://github.com/DanielMontilla" target="_blank" class="link"/>
      </p>
    </div>
    <div 
      class="flex items-center justify-center flex-col text-center space-y-2 grow mb-24"
      :class="[{ 'fade-anim': firstLoad && buttonAnim }, { 'invisible': !buttonAnim }]"
    >
      <div class="font-bold flex flex-col items-center justify-end space-y-4">
        <Button 
          :onClick="goDelayed"
          :sound="{ on: ['key'] }"
          class="xm:h-[105px] h-[80px] xm:text-8xl text-7xl font-mono font-normal px-2 ring-[1px] ring-neutral border-b-8 border-neutral translate-y-1 active:border-b-0 transition-[border] duration-75 ease-linear bg-highlight-light dark:bg-highlight-dark inline-grid place-items-center rounded-md"
        >
          <p v-text="workoutsExists ? `select` : `create`" class="leading-none"/>
        </Button>
        <div v-text="`workout`" class="xm:text-6xl text-4xl "/>
      </div>
    </div>
    <div
      class="absolute top-1 right-1 z-20 flex items-center justify-end space-x-2"
      @click="toggleTheme"
      :class="[{'other-anim': firstLoad && otherAnim }, { 'invisible': !otherAnim }]"
    >
      <p v-text="`change theme ➝`" class="italic text-base opacity-75 animate-pulse"/>
      <p v-text="theme == 'light' ? `🌑` : `🌕`" class="text-2xl"/>
    </div>
    <div
      class="absolute w-full bottom-[72px] left-0 flex justify-between px-4 sm:text-base text-sm"
      :class="[{'other-anim': firstLoad && otherAnim }, { 'invisible': !otherAnim }]"
    >
      <a v-text="`about`" href="https://github.com/DanielMontilla/interval-timer#readme" class="link opacity-80" target="_blank"/>
      <div v-text="`© ${new Date().getFullYear()} Daniel Montilla`" class="opacity-60"/>
      <a v-text="`source`" href="https://github.com/DanielMontilla/interval-timer" class="link opacity-80" target="_blank"/>
    </div>
  </div>
</template>

<style scoped>
  .link {
    @apply underline text-accent dark:decoration-text-dark/50 decoration-text-light/50 italic;
  }

  .title-anim {
    animation: fade-in 2s ease-in, appear-in 2s ease-out;
  }

  .author-anim {
    animation: slide-in-left 1.2s ease-out;
  }

  .fade-anim {
    animation: fade-in 1.75s ease-out;
  }
  
  .other-anim {
    animation: fade-in .75s linear;
  }

  @keyframes fade-in {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes appear-in {
    0% {
      -webkit-transform: scale(1.25);
              transform: scale(1.25);
    }
    100% {
      -webkit-transform: scale(1);
              transform: scale(1);
    }
  }

  @keyframes slide-in-left {
  0% {
    -webkit-transform: translateX(-200%);
            transform: translateX(-200%);
  }
  100% {
    -webkit-transform: translateX(0);
            transform: translateX(0);
  }
}
  @keyframes slide-in-bottom {
  0% {
    -webkit-transform: translateY(150%);
            transform: translateY(150%);
  }
  100% {
    -webkit-transform: translateY(0);
            transform: translateY(0);
  }
}

</style>
