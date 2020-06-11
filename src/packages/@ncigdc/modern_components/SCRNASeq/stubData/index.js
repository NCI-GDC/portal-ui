import tsne from './tsne';
import umap from './umap';
import pca from './pca';

const data = {
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
