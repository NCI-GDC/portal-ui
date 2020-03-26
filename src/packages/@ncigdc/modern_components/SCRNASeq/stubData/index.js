import tsne from './tsne';
// import tsne3d from './tsne3d';
import umap from './umap';
// import umap3d from './umap3d';
import pca from './pca';

const data = {
  // tsne3d,
  // umap3d,
  umap: {
    data: umap,
    name: 'UMAP',
  },
  tsne: {
    data: tsne,
    name: 't-SNE',
  },
  pca: {
    data: pca,
    name: 'PCA',
  },
};

export default data;
