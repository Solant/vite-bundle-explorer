export function getPath(edges: Array<[number, number]>, source: number, target: number) {
  const queue: Array<Array<number>> = [[source]];
  while (queue.length) {
    const path = queue.shift()!;
    const last = path[path.length - 1];
    if (last === target) {
      return path;
    }
    for (const edge of edges) {
      if (edge[0] === last && !path.includes(edge[1])) {
        queue.push([...path, edge[1]]);
      }
    }
  }

  return undefined;
}
