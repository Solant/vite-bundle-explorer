<script lang="ts" setup>
import { ref } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import SplitLayout from '@/shared/layouts/SplitLayout.vue';
import { GraphView } from '@/widgets/graph-view';

const props = defineProps<{
  stats: BuildStats;
}>();

const options = ref(GraphView.optionsFactory(props.stats));
</script>

<template>
  <SplitLayout>
    <template #aside>
      <GraphView.OptionsComponent v-model="options" :stats />
    </template>
    <template #main>
      <GraphView.ViewComponent :stats :options class="h-full w-full" />
    </template>
  </SplitLayout>
</template>
