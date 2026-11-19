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
    <ul role="menu" class="min-w-40 border border-gray-200 rounded-md bg-white py-1 text-[13px] shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <li
        v-for="item in items"
        :key="item.label"
        role="menuitem"
        class="cursor-pointer px-2.5 py-1 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="toggle(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>
