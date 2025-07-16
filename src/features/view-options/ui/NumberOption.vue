<script lang="ts" setup>
import Option from '@/features/view-options/ui/Option.vue';

const model = defineModel<number>({ required: true });

defineProps<{ title: string; step?: number }>();
</script>

<template>
  <Option :title>
    <input type="number" v-model.number="model" :step />
  </Option>
</template>
