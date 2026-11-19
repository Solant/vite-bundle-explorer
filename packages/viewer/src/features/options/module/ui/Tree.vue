<script lang="ts">
import {
  defineComponent, h, type PropType, type VNode,
} from 'vue';

import { dfs } from '@/shared/graph';
import { formatSize } from '@/entities/bundle-stats';

import type { ModuleTree } from '../model/module-tree.ts';

const ROW_CLASS = 'group flex h-6 items-center gap-1 overflow-hidden pr-2 cursor-pointer rounded'
  + ' hover:bg-gray-100 dark:hover:bg-gray-800';

const CHEVRON_CLASS = 'flex-none text-[14px] text-gray-400 dark:text-gray-500';

const SIZE_CLASS = 'flex-none ml-1 text-xs tabular-nums text-gray-400 dark:text-gray-500';

export default defineComponent({
  props: {
    data: {
      type: Object as PropType<ModuleTree>,
      required: true,
    },
  },
  emits: [
    'toggle',
    'toggle-visibility',
    'hover',
    'context-menu',
  ],
  setup(props, { emit }) {
    return () => {
      const children: VNode[] = [];

      dfs(
        props.data,
        (node, depth) => {
          children.push(
            h(
              'li',
              {
                role: 'treeitem',
                ariaLevel: depth + 1,
                onClick() {
                  emit('toggle', node);
                },
                onContextmenu(event) {
                  event.preventDefault();
                  emit('context-menu', { node, event });
                },
                class: ROW_CLASS,
                style: { paddingLeft: `${depth * 10 + 6}px` },
              },
              [
                h('div', {
                  class: node.visible
                    ? 'i-mdi:eye-outline flex-none text-[14px] opacity-0 group-hover:opacity-60'
                    : 'i-mdi:eye-off-outline flex-none text-[14px] text-gray-400 dark:text-gray-500',
                  onClick(event) {
                    event.stopPropagation();
                    emit('toggle-visibility', node);
                  },
                }),
                node.children
                  ? h('div', {
                    class: `${node.collapsed ? 'i-mdi:chevron-right' : 'i-mdi:chevron-down'} ${CHEVRON_CLASS}`,
                  })
                  : h('div', { class: 'flex-none w-3.5 h-3.5' }),
                node.icons?.map((icon) => h('div', {
                  class: `inline-block flex-none text-[14px] mr-0.5 ${icon}`,
                })),
                h(
                  'div',
                  { class: 'flex-1 min-w-0 truncate', title: node.title },
                  node.title,
                ),
                node.query && h('div', {
                  class: 'flex-none text-[13px] text-gray-400 i-mdi:help',
                  title: node.query,
                }),
                typeof node.size === 'number'
                  && h('div', { class: SIZE_CLASS }, formatSize(node.size)),
              ],
            ),
          );
        },
        0,
        (node) => !!node.collapsed,
        'pre',
      );
      return h('ul', { role: 'tree', class: 'text-[13px] text-gray-700 dark:text-gray-300' }, children);
    };
  },
});
</script>
