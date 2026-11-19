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
  let observer: ResizeObserver | undefined;

  onMounted(() => {
    const el = target.value;
    if (!el) {
      return;
    }
    chart.value = init(el);
    callback(chart.value);
    observer = new ResizeObserver(() => chart.value?.resize());
    observer.observe(el);
  });

  onUnmounted(() => {
    observer?.disconnect();
    chart.value?.dispose();
  });
  return chart;
}
