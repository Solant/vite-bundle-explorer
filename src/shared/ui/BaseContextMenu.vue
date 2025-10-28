<script setup lang="ts">
import { onClickOutside, useMagicKeys } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

defineProps<{ x: number; y: number; items: Array<{ label: string; onClick: () => void }> }>();

const model = defineModel<boolean>({ required: false });

const { escape } = useMagicKeys();
watch(escape, () => {
  if (model.value) {
    model.value = false;
  }
});

const root = useTemplateRef('root');
onClickOutside(root, () => {
  model.value = false;
});

function toggle(item: { label: string; onClick: () => void }) {
  model.value = false;
  item.onClick();
}
</script>

<template>
  <div v-if="model" class="fixed" :style="{ left: `${x}px`, top: `${y}px` }" ref="root">
    <ul role="menu" class="border border-solid border-gray-300">
      <li
        v-for="item in items"
        role="menuitem"
        :key="item.label"
        @click="toggle(item)"
        class="bg-white px-2 py-1 hover:bg-blue-700 cursor-pointer hover:c-white"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
