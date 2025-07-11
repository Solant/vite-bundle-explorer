<script setup lang="ts">
import { computed } from 'vue';

import type { TreeMapOptions } from './TreeMap.ts';
import { BaseSwitch } from '../shared/ui';

const model = defineModel<TreeMapOptions>({ required: true });

const compact = computed({
  get: () => model.value.compact,
  set: (value) => (model.value = { ...model.value, compact: value }),
});
</script>

<template>
  <div>
    <div class="c-gray-800 flex justify-between">
      Compact

      <BaseSwitch v-model="compact" />
    </div>
  </div>
</template>
