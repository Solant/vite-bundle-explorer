import * as echarts from 'echarts/core';
import { onMounted, onUnmounted, shallowRef, type TemplateRef } from 'vue';

export function useChart(target: TemplateRef<HTMLElement>) {
  const chart = shallowRef<echarts.EChartsType>();

  function resize() {
    chart.value?.resize();
  }

  onMounted(() => {
    chart.value = echarts.init(target.value);
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    chart.value?.dispose();
  });

  return chart;
}
