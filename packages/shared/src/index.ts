export interface Module {
  fileNameIndex: number;
  renderedLength: number;
  virtual?: true;
}

export interface Chunk {
  fileName: string;
  modules: Module[];
  minifiedLength: number;
  compressedLength: number;
}

export interface BuildStats {
  entryPoints: string[];
  moduleFileNames: string[];
  chunks: Chunk[];
  importGraph: {
    edges: Array<[source: number, target: number]>;
  };
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
    }
    return parts[4];
  }

  // npm default logic
  const parts = moduleFileName.split('/');
  const index = parts.lastIndexOf('node_modules');
  if (parts[index + 1].startsWith('@')) {
    return `${parts[index + 1]}/${parts[index + 2]}`;
  }
  return parts[index + 1];
}

export interface BundleOverview {
  hasWarnings: boolean;
  numberOfModules: number;
  numberOfVirtualModules: number;
  numberOfChunks: number;
  numberOfDependencies: number;
  duplicatedDependencies: Array<{ name: string; count: number }>;
}

export function getBundleOverview(stats: BuildStats): BundleOverview {
  const numberOfChunks = stats.chunks.length;

  const numberOfModules = stats.moduleFileNames.length;
  let numberOfVirtualModules = 0;
  for (const chunk of stats.chunks) {
    for (const mod of chunk.modules) {
      if (mod.virtual) {
        numberOfVirtualModules += 1;
      }
    }
  }

  const dependencies = new Map<string, { indices: number[] }>();
  for (const module of stats.moduleFileNames) {
    const dep = getModuleDependencyName(module);
    if (!dep) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const index = module.lastIndexOf(`node_modules/${dep}`);

    const entry = dependencies.get(dep);
    if (entry) {
      if (!entry.indices.includes(index)) {
        entry.indices.push(index);
      }
    } else {
      dependencies.set(dep, { indices: [index] });
    }
  }
  const duplicatedDependencies: BundleOverview['duplicatedDependencies'] = [];
  for (const [dep, entry] of dependencies) {
    if (entry.indices.length > 1) {
      duplicatedDependencies.push({ name: dep, count: entry.indices.length });
    }
  }

  return {
    numberOfModules,
    numberOfVirtualModules,
    numberOfChunks,
    numberOfDependencies: dependencies.size,
    duplicatedDependencies,
    hasWarnings: duplicatedDependencies.length > 0,
  };
}
