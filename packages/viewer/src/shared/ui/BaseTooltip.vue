<script lang="ts" setup>
import { ref, useId, useTemplateRef } from 'vue';
import { onClickOutside } from '@vueuse/core';

const trigger = useTemplateRef('trigger');
const tooltip = useTemplateRef('tooltip');
const tooltipId = useId();

const state = ref(false);
const position = ref({ x: 0, y: 0 });
function toggle() {
  state.value = !state.value;

  if (state.value && trigger.value) {
    const rect = trigger.value.getBoundingClientRect();
    position.value.x = rect.right;
    position.value.y = rect.top;
  }
}

function close() {
  state.value = false;
}
onClickOutside(tooltip, (event) => {
  // pointerdown on the trigger is followed by a click that toggles the tooltip; let it through
  if (trigger.value?.contains(event.target as Node)) return;
  close();
});
</script>

<template>
  <button
    ref="trigger"
    type="button"
    class="cursor-pointer"
    :aria-expanded="state"
    :aria-describedby="state ? tooltipId : undefined"
    @click="toggle"
    @keydown.escape="close"
  >
    <slot />
  </button>

  <teleport to="body">
    <div
      v-if="state"
      :id="tooltipId"
      ref="tooltip"
      role="tooltip"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
      class="absolute max-w-[350px] border border-gray-200 rounded-md bg-white px-3 py-2 text-[13px] text-gray-700 shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
    >
      <slot name="content" />
    </div>
  </teleport>
</template>
