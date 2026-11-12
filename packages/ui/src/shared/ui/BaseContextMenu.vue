<script setup lang="ts">
import { onClickOutside, useMagicKeys } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

defineProps<{ x: number; y: number; items: Array<{ label: string; onClick: () => void }> }>();

const model = defineModel<boolean>({ required: false });

const { escape } = useMagicKeys();
watch(escape, () => {
  model.value &&= false;
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
  <div
    v-if="model"
    ref="root"
    class="fixed"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <ul role="menu" class="border border-gray-300 border-solid text-sm shadow-md dark:border-gray-700">
      <li
        v-for="item in items"
        :key="item.label"
        role="menuitem"
        class="cursor-pointer bg-white px-2 py-1 dark:bg-gray-800 hover:bg-blue-700 dark:c-white hover:c-white"
        @click="toggle(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
