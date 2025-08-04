import type { InjectionKey } from 'vue';

export const nestedGroupSymbol = Symbol('nested') as InjectionKey<boolean>;
