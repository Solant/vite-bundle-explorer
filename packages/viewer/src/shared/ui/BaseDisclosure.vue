<script lang="ts" setup>
import { useId, computed } from 'vue';

const props = defineProps<{
  persistent?: boolean;
  labelClass?: string;
  panelClass?: string;
}>();

const open = defineModel<boolean>('open', { required: false, default: false });

const panelId = useId();

const panelStyle = computed(() => {
  let style: string | undefined;
  if (props.persistent) {
    style = open.value ? undefined : 'none';
  }

  return { style };
});

function toggle(state?: boolean) {
  open.value = state ?? !open.value;
}
</script>

<template>
  <button
    type="button"
    :class="labelClass"
    :aria-expanded="open"
    :aria-controls="panelId"
    @click="toggle()"
  >
    <slot name="label" :is-open="open" :toggle />
  </button>

  <div
    v-if="persistent || open"
    :id="panelId"
    :style="panelStyle"
    :class="panelClass"
  >
    <slot />
  </div>
</template>
