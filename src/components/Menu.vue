<script setup lang="ts">
   import { computed } from 'vue';
   interface MenuProps {
      options: {
         label: string;
         callback: () => void;
         iconSrc?: string;
         color?: string;
         confirm?: boolean;
      }[];
      close: () => void;
   }

   const { options } = defineProps<MenuProps>();
</script>

<template>
   <div class="menu-area d-grid" @click="close">
      <div class="area-content d-flex" @click.stop="() => {}">
         <!-- TODO: add confirm prompt -->
         <div
            v-for="{ label, callback, iconSrc, color } in options"
            class="option-card"
            @click="[callback(), close()]"
         >
            <img
               class="option-icon"
               :src="`/interval-timer/icons/${iconSrc ? iconSrc : 'bullet'}.svg`"
               :style="{
                  filter: `var(--f-${color ? color : 'white'})`,
               }"
            />
            <div class="option-label">
               {{ label }}
            </div>
         </div>
      </div>
   </div>
</template>

<style scoped>
   * {
      --rad: var(--md);
      --card-height: calc(var(--base) * 4);
      --border: 1px solid rgba(255, 255, 255, 0.2);
   }
   .menu-area {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      backdrop-filter: blur(3px);
   }
   .area-content {
      min-width: calc(var(--base) * 14);
      flex-direction: column;

      background: rgba(0, 0, 0, 0.4);
      border-radius: var(--sm);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      -webkit-backdrop-filter: blur(5px);
      border: var(--border);
   }

   .area-content > * + * {
      border-top: var(--border);
   }

   .option-card {
      height: var(--card-height);
      padding: var(--sm) var(--md);
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
   }

   .option-card > * + * {
      margin-left: var(--lg);
   }

   .option-icon {
      --size: calc(var(--card-height) * 0.6);
      height: var(--size);
      width: var(--size);
   }

   .option-label {
      font-size: calc(var(--card-height) * 0.6);
      font-weight: 500;
      color: rgb(224, 224, 224);
   }
</style>
