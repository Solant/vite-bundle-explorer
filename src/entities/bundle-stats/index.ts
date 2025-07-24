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

export function isDependency(moduleFileName: string): boolean {
  return moduleFileName.startsWith('node_modules');
}

export function getModuleDependencyName(moduleFileName: string): string {
  if (!isDependency(moduleFileName)) {
    return '';
  }

  // pnpm-specific logic
  if (moduleFileName.startsWith('node_modules/.pnpm')) {
    const parts = moduleFileName.split('/');
    if (parts[4].startsWith('@')) {
      return `${parts[4]}/${parts[5]}`;
    } else {
      return parts[4];
    }
  }

  // npm default logic
  const parts = moduleFileName.split('/');
  if (parts[1].startsWith('@')) {
    return `${parts[1]}/${parts[2]}`;
  } else {
    return parts[1];
  }
}
