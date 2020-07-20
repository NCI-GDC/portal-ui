export const DESIREDHEADERS = [
  'cell_barcode',
  'read_count',
  'gene_count',
  'seurat_cluster',
  'UMAP_1',
  'UMAP_2',
  // 'UMAP3d_1',
  // 'UMAP3d_2',
  // 'UMAP3d_3',
  'tSNE_1',
  'tSNE_2',
  // 'tSNE3d_1',
  // 'tSNE3d_2',
  // 'tSNE3d_3',
  'PC_1',
  'PC_2',
  // 'PC_3',
  // 'PC_4',
  // 'PC_5',
  // 'PC_6',
  // 'PC_7',
  // 'PC_8',
  // 'PC_9',
  // 'PC_10',
];


export const MISLABELEDHEADERS = {
  pca: 'pc',
};

export const PLOTLYCONFIGS = {
  clusteringMethods: [
    'UMAP',
    't-SNE',
    'PCA',
  ],
  rowBaseTemplate: is3D => ({ // based on CellRanger clustered example
    hoverinfo: 'name',
    marker: {
      size: 4,
    },
    mode: 'markers',
    type: is3D ? 'scatter3d' : 'scattergl',
  }),
};
