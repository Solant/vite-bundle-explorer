export { removeEmptyLeafs, removeNodes } from './model/graph.ts';

export interface Module {
  fileNameIndex: number;
  renderedLength: number;
  virtual?: true;
}

export interface Chunk {
  fileName: string;
  modules: Module[];
}

export interface BuildStats {
  moduleFileNames: string[];
  chunks: Chunk[];
  importGraph: {
    edges: Array<[source: number, target: number]>;
  };
}

export function getModuleSize(
  moduleFileName: string | number,
  stats: BuildStats,
): number | undefined {
  const index =
    typeof moduleFileName === 'string'
      ? stats.moduleFileNames.indexOf(moduleFileName)
      : moduleFileName;
  if (index === -1) {
    return undefined;
  }

  for (const chunk of stats.chunks) {
    for (const mod of chunk.modules) {
      if (mod.fileNameIndex === index) {
        return mod.renderedLength;
      }
    }
  }
}

export function formatSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
  }
}

export function formatModuleSize(chunkFileName: string | number, stats: BuildStats) {
  const size = getModuleSize(chunkFileName, stats);

  return formatSize(size ?? 0);
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
  const index = parts.lastIndexOf('node_modules');
  if (parts[index + 1].startsWith('@')) {
    return `${parts[index + 1]}/${parts[index + 2]}`;
  } else {
    return parts[index + 1];
  }
}
