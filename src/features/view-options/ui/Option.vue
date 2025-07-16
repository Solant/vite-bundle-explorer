<script setup lang="ts">
defineProps<{ title: string }>();
</script>

<template>
  <div class="c-slate-800 flex justify-between my-2">
    {{ title }}

    <slot />
  </div>
</template>
