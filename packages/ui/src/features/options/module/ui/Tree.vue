<script lang="ts">
import {
  defineComponent, h, type PropType, type VNode,
} from 'vue';

import { dfs } from '@/shared/graph';
import { formatSize } from '@/entities/bundle-stats';

import type { ModuleTree } from '../model/module-tree.ts';

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
                class: 'flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 overflow-hidden py-1',
              },
              [
                h('div', {
                  class: node.visible
                    ? 'i-mdi:eye-outline flex-none'
                    : 'i-mdi:eye-off-outline flex-none opacity-50',
                  onClick(event) {
                    event.stopPropagation();
                    emit('toggle-visibility', node);
                  },
                  style: { marginRight: `${depth ? depth * 12 : 4}px` },
                }),
                node.children
                  ? h('div', {
                    class: `${node.collapsed ? 'i-mdi:chevron-right' : 'i-mdi:chevron-down'} flex-none`,
                  })
                  : h('div', { class: 'flex-none w-4 h-4' }),
                node.icons?.map((icon) => h('div', {
                  class: `inline-block flex-none ${icon} mr-1`,
                })),
                h(
                  'div',
                  { class: 'flex-1-1 min-w-0 truncate text-sm', title: node.title },
                  node.title,
                ),
                node.query && h('div', { class: 'flex-none ml-1 i-mdi:help', title: node.query }),
                typeof node.size === 'number'
                  && h('div', { class: 'flex-none ml-auto text-sm' }, formatSize(node.size)),
              ],
            ),
          );
        },
        0,
        (node) => !!node.collapsed,
        'pre',
      );
      return h('ul', { role: 'tree', class: 'c-gray-900 dark:c-white' }, children);
    };
  },
});
</script>
