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
    const { transcript } = get(hit, 'consequence.hits.edges[0].node');
    const {
      annotation = {},
      consequence_type: consequenceType = '',
      gene = {},
      aa_change: aaChange,
    } =
      transcript || {};
    const { symbol: geneSymbol, gene_id: geneId } = gene;

    return {
      ...hit,
      impact: annotation.impact,
      polyphen_impact: annotation.polyphen_impact,
      polyphen_score: annotation.polyphen_score,
      sift_impact: annotation.sift_impact,
      sift_score: annotation.sift_score,
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
