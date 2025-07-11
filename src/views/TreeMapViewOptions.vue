<script setup lang="ts">
import { computed } from 'vue';

import type { TreeMapOptions } from './TreeMap.ts';

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
      <select v-model="compact">
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>
    </div>
  </div>
</template>
