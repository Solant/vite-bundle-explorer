export interface BaseOptions {
  hiddenModules: string[];
  hiddenChunks: string[];
}

export interface TreeMapOptions extends BaseOptions {
  compact: boolean;
}

export const getDefaultTreeMapOptions = (): TreeMapOptions => ({
  compact: true,
  hiddenModules: [],
  hiddenChunks: [],
});
