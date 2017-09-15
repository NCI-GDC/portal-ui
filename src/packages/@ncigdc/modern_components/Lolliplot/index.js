import { compose, withPropsOnChange } from 'recompose';
import createRendererSsm from './SsmLolliplot.relay';
import createRendererGene from './GeneLolliplot.relay';
import LoadableWithLoading from '@ncigdc/components/LoadableWithLoading';

// This is the component used for the gene entity page

const GeneLolliplot = createRendererGene(
  LoadableWithLoading({ loader: () => import('./LolliplotWrapper') }),
);

// This is the above component which first receives a single ssm and finds
// the canonical transcript's geneId to pass to it

const GeneLolliplotWrapper = compose(
  withPropsOnChange(
    ['ssmsViewer'],
    ({ ssmsViewer: { explore: { ssms: { hits: { edges } } } } }) => ({
      node: edges[0].node,
    }),
  ),
  withPropsOnChange(['node'], ({ node }) => ({
    geneId: (node.consequence.hits.edges.find(
      x => x.node.transcript.is_canonical,
    ) || { node: { transcript: { gene: { gene_id: '' } } } }).node.transcript
      .gene.gene_id,
  })),
)(GeneLolliplot);

// This is the component used for the ssm entity page

const SsmLolliplot = createRendererSsm(GeneLolliplotWrapper);

export { SsmLolliplot, GeneLolliplot };
