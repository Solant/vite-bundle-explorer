import { computed, type ComputedRef, type ModelRef } from 'vue';

export function useModelProxy<T, K extends keyof T>(model: ModelRef<T>, key: K): ComputedRef<T[K]> {
  return computed({
    get: () => model.value[key],
    set: (value) => {
      // eslint-disable-next-line no-param-reassign
      model.value = { ...model.value, [key]: value };
    },
  });
}
