import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';

import { type BuildStats } from '@/entities/bundle-stats';

export interface Position {
  x: number;
  y: number;
}

interface SimNode {
  name: string;
  x: number;
  y: number;
  radius: number;
}

interface SimLink {
  source: SimNode;
  target: SimNode;
}

/** Golden-angle phyllotaxis step between successive spiral rings, px. */
const SPIRAL_STEP = 14;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
/** Total simulation ticks the time budget buys; split across every node. */
const TICK_BUDGET = 72_000;
const MIN_TICKS = 60;
const MAX_TICKS = 200;
const LINK_GAP = 20;
const LINK_STRENGTH = 0.5;
interface LayoutParams {
  charge: number;
  chargeRange: number;
  chargeTheta: number;
  collidePad: number;
  collideFrom: number;
  linkStrength: (fanOut: number) => number;
}

const LAYOUTS: Record<'dense' | 'spread', LayoutParams> = {
  /** constant link strength: hubs pull their whole package into a dense ball */
  dense: {
    charge: -90,
    chargeRange: 320,
    chargeTheta: 1.4,
    collidePad: 2,
    collideFrom: 0.6,
    linkStrength: () => LINK_STRENGTH,
  },
  /** degree-normalized link strength keeps dense package clusters inflated */
  spread: {
    charge: -120,
    // cuts long-range repulsion so distant clusters do not blow the graph apart
    chargeRange: 600,
    chargeTheta: 1.0,
    collidePad: 4,
    // collision kicks in late, once the clusters have settled
    collideFrom: 0.3,
    linkStrength: (fanOut: number) => Math.min(1, (LINK_STRENGTH * 3) / fanOut),
  },
};

const CENTER_PULL = 0.05;

/**
 * Deterministic PRNG (numerical recipes LCG, plain arithmetic so it stays
 * exact in doubles): d3-force falls back to it whenever it needs to nudge
 * coincident nodes, keeping the layout reproducible.
 */
function seededRandom(seed: number) {
  let state = ((seed % 4294967296) + 4294967296) % 4294967296;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

/**
 * Precomputed force-directed layout, like the echarts "NPM Dependencies"
 * example: the simulation runs once per build stats and the result is
 * rendered with `layout: 'none'`, so there is no live physics at all.
 *
 * Nodes are seeded on a phyllotaxis spiral in BFS order from the entry
 * points (related modules start adjacent, entries in the center), then
 * relaxed by d3-force until it settles.
 *
 * Positions are computed for the full module set, so filtering nodes
 * (compact mode, hidden modules) never moves the remaining ones.
 */
export function computeLayout(
  stats: BuildStats,
  symbolSizeOf: (moduleFileName: string) => number,
  dense = false,
): Map<string, Position> {
  const { moduleFileNames: nodes, importGraph } = stats;
  const positions = new Map<string, Position>();

  if (nodes.length === 0) {
    return positions;
  }
  const params = dense ? LAYOUTS.dense : LAYOUTS.spread;

  // BFS from entry points: seeds the spiral so every subtree starts
  // as a contiguous sector; modules unreachable from an entry get their
  // own subtree instead of a random spot.
  const adjacency: number[][] = nodes.map(() => []);
  for (const [source, target] of importGraph.edges) {
    if (source !== target) {
      adjacency[source].push(target);
    }
  }
  for (const children of adjacency) {
    children.sort((a, b) => a - b);
  }

  const nameIndex = new Map(nodes.map((name, index) => [name, index] as const));
  const enqueued = new Uint8Array(nodes.length);
  const queue: number[] = [];

  for (const entry of stats.entryPoints) {
    const index = nameIndex.get(entry);

    if (index !== undefined && !enqueued[index]) {
      enqueued[index] = 1;
      queue.push(index);
    }
  }

  let head = 0;
  let candidate = 0;
  while (head < queue.length) {
    const current = queue[head];
    head += 1;

    for (const next of adjacency[current]) {
      if (!enqueued[next]) {
        enqueued[next] = 1;
        queue.push(next);
      }
    }

    if (head === queue.length) {
      while (candidate < nodes.length && enqueued[candidate]) {
        candidate += 1;
      }
      if (candidate < nodes.length) {
        enqueued[candidate] = 1;
        queue.push(candidate);
      }
    }
  }

  const simNodes: SimNode[] = queue.map((index, rank) => {
    const angle = rank * GOLDEN_ANGLE;
    const spiralRadius = SPIRAL_STEP * Math.sqrt(rank);

    return {
      name: nodes[index],
      x: Math.cos(angle) * spiralRadius,
      y: Math.sin(angle) * spiralRadius,
      radius: symbolSizeOf(nodes[index]) / 2,
    };
  });

  // d3-force overwrites node.index with the array position, so edges are
  // wired to node objects directly instead of numeric module indices
  const simNodeByModuleIndex: Array<SimNode | undefined> = Array.from({ length: nodes.length });
  queue.forEach((index, rank) => {
    simNodeByModuleIndex[index] = simNodes[rank];
  });

  const links: SimLink[] = importGraph.edges
    .filter(([source, target]) => source !== target)
    .map(([source, target]) => ({
      source: simNodeByModuleIndex[source]!,
      target: simNodeByModuleIndex[target]!,
    }));

  const degree = new Map<SimNode, number>();
  for (const { source, target } of links) {
    degree.set(source, (degree.get(source) ?? 0) + 1);
    degree.set(target, (degree.get(target) ?? 0) + 1);
  }

  // settle within the tick budget no matter the graph size
  const maxTicks = Math.round(
    Math.min(MAX_TICKS, Math.max(MIN_TICKS, TICK_BUDGET / nodes.length)),
  );

  const simulation = forceSimulation(simNodes)
    .force('link', forceLink(links)
      .distance((link) => {
        // d3 replaces the numeric endpoints with node objects on initialization
        const source = link.source as SimNode;
        const target = link.target as SimNode;

        return source.radius + target.radius + LINK_GAP;
      })
      .strength((link) => {
        const source = link.source as SimNode;
        const target = link.target as SimNode;
        const fanOut = Math.min(degree.get(source) ?? 1, degree.get(target) ?? 1);

        // spread normalizes like d3's default (1 / min(degree)) so package
        // clusters stop contracting into a ball; dense pulls every link
        // with full constant strength
        return params.linkStrength(fanOut);
      }))
    .force('charge', forceManyBody()
      .strength(params.charge)
      .distanceMax(params.chargeRange)
      .theta(params.chargeTheta))
    .force('x', forceX(0).strength(CENTER_PULL))
    .force('y', forceY(0).strength(CENTER_PULL))
    .randomSource(seededRandom(42))
    .stop();

  simulation.alphaDecay(1 - simulation.alphaMin() ** (1 / maxTicks));
  const collideTick = Math.floor(maxTicks * params.collideFrom);
  for (let tick = 0; tick < maxTicks && simulation.alpha() > simulation.alphaMin(); tick += 1) {
    if (tick === collideTick) {
      simulation.force('collide', forceCollide((node: SimNode) => node.radius + params.collidePad));
    }
    simulation.tick();
  }

  // recenter the whole blob on the mass centroid
  const centerX = simNodes.reduce((acc, node) => acc + node.x, 0) / simNodes.length;
  const centerY = simNodes.reduce((acc, node) => acc + node.y, 0) / simNodes.length;
  for (const node of simNodes) {
    positions.set(node.name, { x: node.x - centerX, y: node.y - centerY });
  }

  return positions;
}
