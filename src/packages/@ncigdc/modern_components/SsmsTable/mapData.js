// @flow
import { get } from 'lodash';

const mutationSubTypeMap = {
  'single base substitution': 'Substitution',
  'small deletion': 'Deletion',
  'small insertion': 'Insertion',
};

type TMapData = (data: Array<Object>, theme: Object) => Array<Object>;

const mapData: TMapData = (data, theme) =>
  data.map(hit => {
    const consequenceOfInterest =
      hit.consequence.hits.edges.find(
        consequence => get(consequence, 'node.transcript.annotation.impact'),
        {},
      ) || {};
    const { transcript } = consequenceOfInterest.node || {};
    const {
      annotation = {},
      consequence_type: consequenceType = '',
      gene = {},
      aa_change: aaChange,
    } =
      transcript || {};
    const { symbol: geneSymbol, gene_id: geneId } = gene;
    const impact = annotation.impact;

    return {
      ...hit,
      impact,
      mutation_subtype:
        mutationSubTypeMap[(hit.mutation_subtype || '').toLowerCase()] ||
          hit.mutation_subtype,
      geneId,
      geneSymbol,
      consequenceType,
      aaChange,
    };
  });

export default mapData;
