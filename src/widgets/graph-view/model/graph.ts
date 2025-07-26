export interface GraphOptions {
  forceRepulsion: number;
  forceGravity: number;
  forceEdgeLength: number;
  forceFriction: number;
  compact: boolean;
}

export function optionsFactory(): GraphOptions {
  return {
    forceRepulsion: 50,
    forceGravity: 0.1,
    forceEdgeLength: 30,
    forceFriction: 0.6,
    compact: false,
  };
}
