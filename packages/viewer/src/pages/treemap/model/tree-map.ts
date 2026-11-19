export interface TreeMapChartNode {
  value: number;
  moduleIndex?: number;
  name: string;
  path: string;
  children: TreeMapChartNode[];
  upperLabel: {
    backgroundColor: string;
  };
  itemStyle: {
    color: string;
    borderColor: string;
  };
}

export function dfs(
  nodes: TreeMapChartNode[],
  callback: (node: TreeMapChartNode, depth: number) => void,
  depth = 0,
) {
  for (const node of nodes) {
    dfs(node.children, callback, depth + 1);
    callback(node, depth);
  }
}
