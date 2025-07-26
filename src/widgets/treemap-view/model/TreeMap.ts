export interface BaseOptions {
  hiddenModules: number[];
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
