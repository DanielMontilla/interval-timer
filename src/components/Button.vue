<script setup lang="ts">
  import { useSound } from '@/services/_index'
  interface ButtonProps { onClick?: Function, sound?: string[] | null, disabled?: boolean, clickable?: boolean }

  const props = withDefaults(
    defineProps<ButtonProps>(), {
      onClick: () => () => undefined,
      sound: () => ['click'],
      disabled: () => false,
      clickable: () => true,
    }
  );

  const click = () => {
    if (!props.clickable) return;
    props.onClick();
    if (!props.sound) return;
    const { play } = useSound();
    // TODO: pick random sound from `sounds` prop
    play(`sounds/${props.sound[0]}.mp3`);
  }
</script>

<template>
  <div class="button" :class="{ disabled: props.disabled }" @click="click">
    <slot/>
  </div>
</template>

<style scoped>
  .disabled {
    @apply
      grayscale;
  }
</style>
