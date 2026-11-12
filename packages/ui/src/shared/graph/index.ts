export function dfs<T extends { children?: Array<T> }>(
  nodes: T[],
  callback: (node: T, depth: number) => void,
  depth = 0,
  skipChildren?: (node: T) => boolean,
  order: 'pre' | 'post' = 'pre',
) {
  for (const node of nodes) {
    if (order === 'pre') {
      callback(node, depth);
    }

    if (node.children) {
      if (!skipChildren?.(node)) {
        dfs(node.children, callback, depth + 1, skipChildren, order);
      }
    }

    if (order === 'post') {
      callback(node, depth);
    }
  }
}

type Comparator<T> = (a: T, b: T) => number;

export function sort<T extends { children?: Array<T> }>(nodes: T[], compare: Comparator<T>) {
  nodes.sort(compare);

  for (const node of nodes) {
    if (node.children) {
      sort(node.children, compare);
    }
  }
}
