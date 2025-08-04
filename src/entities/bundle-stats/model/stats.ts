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
  moduleFileNames: string[];
  chunks: Chunk[];
  importGraph: {
    edges: Array<[source: number, target: number]>;
  };
}
