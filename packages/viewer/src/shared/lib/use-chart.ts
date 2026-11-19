import { use, init, type EChartsType } from 'echarts/core';
import {
  onMounted, onUnmounted, shallowRef, type TemplateRef,
} from 'vue';

export function useChart(
  target: TemplateRef<HTMLElement>,
  extensions: Parameters<typeof use>[number],
  callback: (chart: EChartsType) => void,
) {
  use(extensions);
  const chart = shallowRef<EChartsType>();

  function resize() {
    chart.value?.resize();
  }

  onMounted(() => {
    chart.value = init(target.value);
    callback(chart.value);
    window.addEventListener('resize', resize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', resize);
    chart.value?.dispose();
  });

  return chart;
}
