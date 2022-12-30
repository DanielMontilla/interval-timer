<script setup lang="ts">
  import { useSound } from '@/services/_index'
import { randPick } from '@/util';

  interface ButtonProps {
    onClick?: Function, // invoked callback when clickable and not disabled!
    sound?: { success?: string[], failed?: string[], on?: string[], volume?: number } | null,
    clickable?: boolean | (() => boolean),
    disabled?: boolean,
    disabledClass?: string,
    activeClass?: string,
    cooldown?: number | null
  }

  const props = withDefaults(
    defineProps<ButtonProps>(), {
      onClick: () => () => undefined,
      sound: () => null,
      disabled: () => false,
      clickable: () => true,
      disabledClass: () => `grayscale`,
      activeClass: () => ``,
      cooldown: () => null
    }
  );

  let _onCooldown = false;

  const click = () => {
    const { clickable, sound, onClick, cooldown } = props;
    const { play } = useSound();

    if (_onCooldown) return;

    if (cooldown !== null) {
      _onCooldown = true;
      setTimeout(() => _onCooldown = false, cooldown);
    }

    const canClick = typeof clickable === 'function' ? clickable() : clickable;
    const volume = sound && sound.volume
      ? sound.volume
      : 0.5;

    if (sound && sound.on && sound.on.length > 0) {
      play(`sounds/${randPick(sound.on)}.mp3`, volume)
    }

    if (!canClick) {
      if (sound && sound.failed && sound.failed.length > 0) {
        play(`sounds/${randPick(sound.failed)}.mp3`, volume)
      }
      return;
    }

    if (sound && sound.success && sound.success.length > 0) {
      play(`sounds/${randPick(sound.success)}.mp3`, volume)
    }
    onClick();
  }
</script>

<template>
  <div @click="click" 
    :class="[
      `${ disabled ? disabledClass : activeClass }`,
      {'pointer-events-none': disabled },
    ]"
  >
    <slot/>
  </div>
</template>

<style scoped>
</style>
