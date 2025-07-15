import { computed, type ComputedRef, type ModelRef } from 'vue';

export function useModelProxy<T, K extends keyof T>(model: ModelRef<T>, key: K): ComputedRef<T[K]> {
  return computed({
    get: () => model.value[key],
    set: (value) => {
      model.value = { ...model.value, [key]: value };
    },
  });
}
