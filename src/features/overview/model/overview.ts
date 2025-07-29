import { type BuildStats, getModuleDependencyName } from '@/entities/bundle-stats';

interface BundleOverview {
  hasWarnings: boolean;
  numberOfModules: number;
  numberOfVirtualModules: number;
  numberOfChunks: number;
  numberOfDependencies: number;
  duplicatedDependencies: Array<{ name: string; count: number }>;
}

export function getBundleOverview(stats: BuildStats): BundleOverview {
  const numberOfChunks = stats.chunks.length;

  let numberOfModules = 0;
  let numberOfVirtualModules = 0;
  for (const chunk of stats.chunks) {
    numberOfModules += chunk.modules.length;
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
