<script setup lang="ts">
   interface AlertMenuProps {
      messege: string;
      confirm: () => any;
      deny: () => any;
   }
   const { messege, confirm, deny } = defineProps<AlertMenuProps>();
</script>

<template>
   <div class="alert-menu"></div>
</template>

<style>
   .alert-menu {
   }
</style>
