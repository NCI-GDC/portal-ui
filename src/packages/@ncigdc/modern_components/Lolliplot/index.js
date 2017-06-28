import { compose, withPropsOnChange } from 'recompose';
import Component from './LolliplotWrapper';
import createRendererSsm from './SsmLolliplot.relay';
import createRendererGene from './GeneLolliplot.relay';

const GeneLolliplot = createRendererGene(Component);

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

const SsmLolliplot = createRendererSsm(GeneLolliplotWrapper);

export { SsmLolliplot, GeneLolliplot };
