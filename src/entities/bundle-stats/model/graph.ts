import { type BuildStats, getModuleSize, type Metric } from '@/entities/bundle-stats';

export function removeEmptyLeafs(
  nodes: string[],
  edges: [start: number, end: number][],
  stats: BuildStats,
  metric: Metric,
) {
  let removedNodes = 0;
  do {
    removedNodes = 0;
    const emptyNodes: number[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const children = [];
      for (let j = 0; j < edges.length; j += 1) {
        if (edges[j][0] === i) {
          children.push(edges[j][1]);
        }
      }

      if (children.length === 0 && !getModuleSize(nodes[i], stats, metric)) {
        emptyNodes.push(i);
      }
    }
    removedNodes = emptyNodes.length;

    const result = removeNodes(nodes, edges, emptyNodes);
    nodes = result.nodes;
    edges = result.edges;
  } while (removedNodes);

  return { nodes, edges };
}

export function removeNodes(
  nodes: string[],
  edges: [start: number, end: number][],
  nodesToRemove: number[],
  copy = true,
) {
  let updatedNodes = copy ? [...nodes] : nodes;
  let updatedEdges = copy
    ? edges.map(([source, target]) => [source, target] as [number, number])
    : edges;

  for (const k of [...nodesToRemove].sort((a, b) => b - a)) {
    updatedEdges = updatedEdges.filter(([source, target]) => source !== k && target !== k);
    updatedNodes = updatedNodes.filter((_node, index) => index !== k);

    updatedEdges.forEach((edge) => {
      if (edge[0] > k) {
        edge[0] -= 1;
      }
      if (edge[1] > k) {
        edge[1] -= 1;
      }
    });
  }

  return { nodes: updatedNodes, edges: updatedEdges };
}
