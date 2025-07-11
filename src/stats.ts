export interface Module {
  fileName: string;
  renderedLength: number;
}

export interface Chunk {
  fileName: string;
  modules: Module[];
}

export interface BuildStats {
  chunks: Chunk[];
  importGraph: {
    nodes: string[];
    edges: Array<[source: number, target: number]>;
  };
}
