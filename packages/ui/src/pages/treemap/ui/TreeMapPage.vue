<script lang="ts" setup>
import { ref } from 'vue';

import type { BuildStats } from '@/entities/bundle-stats';
import SplitLayout from '@/shared/layouts/SplitLayout.vue';
import { TreemapView } from '@/widgets/treemap-view';

const props = defineProps<{
  stats: BuildStats;
}>();

const options = ref(TreemapView.optionsFactory(props.stats));
</script>

<template>
  <SplitLayout>
    <template #aside>
      <TreemapView.OptionsComponent v-model="options" :stats />
    </template>
    <template #main>
      <TreemapView.ViewComponent :stats :options class="h-full w-full" />
    </template>
  </SplitLayout>
</template>
