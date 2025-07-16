export interface Module {
  fileName: string;
  renderedLength: number;
  virtual?: true;
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

export function getModuleSize(moduleFileName: string, stats: BuildStats): number | undefined {
  for (const chunk of stats.chunks) {
    for (const mod of chunk.modules) {
      if (mod.fileName === moduleFileName) {
        return mod.renderedLength;
      }
    }
  }
}
