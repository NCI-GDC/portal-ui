import { fetchApiChunked } from '@ncigdc/utils/ajax';
import { makeFilter } from '@ncigdc/utils/filters';

function _getIds(obj, path) {
  const [segment] = path;
  const data = obj[segment];

  if (data) {
    if (typeof data === 'object') {
      return []
        .concat(data)
        .reduce((acc, o) => acc.concat(getIds(o, path.slice(1))), []);
    } else if (path.length === 1) {
      return [data];
    }
  }

  return [];
}
export function getIds(obj, path) {
  return _getIds(obj, Array.isArray(path) ? path : path.split('.'));
}

function updateMap(map, ids, hits) {
  hits.forEach(hit => {
    ids.forEach(field => {
      getIds(hit, field, []).forEach(value => (map[value.toUpperCase()] = hit));
    });
  });
}

export const GENE_ID_FIELD_DISPLAY = {
  symbol: 'Symbol',
  gene_id: 'Ensembl',
  'external_db_ids.entrez_gene': 'Entrez',
  'external_db_ids.hgnc': 'HGNC',
  'external_db_ids.uniprotkb_swissprot': 'UniProtKB/Swiss-Prot',
  'external_db_ids.omim_gene': 'OMIM',
};
export const GENE_ID_FIELDS = Object.keys(GENE_ID_FIELD_DISPLAY);
export const geneMap = {};
export const validateGenes = validate(GENE_ID_FIELDS, geneMap, 'gene', 'genes');

export const SSM_ID_FIELD_DISPLAY = {
  ssm_id: 'Mutation UUID',
  genomic_dna_change: 'DNA Change',
};
export const SSM_ID_FIELDS = Object.keys(SSM_ID_FIELD_DISPLAY);
export const ssmMap = {};
export const validateSsms = validate(SSM_ID_FIELDS, ssmMap, 'ssm', 'ssms');

export const CASE_ID_FIELD_DISPLAY = {
  case_id: 'Case UUID',
  submitter_id: 'Case ID',
  'samples.sample_id': 'Sample UUID',
  'samples.submitter_id': 'Sample ID',
  'samples.portions.portion_id': 'Portion UUID',
  'samples.portions.submitter_id': 'Portion ID',
  'samples.portions.slides.slide_id': 'Slide UUID',
  'samples.portions.slides.submitter_id': 'Slide ID',
  'samples.portions.analytes.analyte_id': 'Analyte UUID',
  'samples.portions.analytes.submitter_id': 'Analyte ID',
  'samples.portions.analytes.aliquots.aliquot_id': 'Aliquot UUID',
  'samples.portions.analytes.aliquots.submitter_id': 'Aliquot ID',
};
export const CASE_ID_FIELDS = Object.keys(CASE_ID_FIELD_DISPLAY);
export const caseMap = {};
export const validateCases = validate(
  CASE_ID_FIELDS,
  caseMap,
  'case',
  'cases',
  ['project.project_id'],
);

function validate(idFields, map, field, endpoint, extraFields = []) {
  return async (ids = [], onValidatingStateChange) => {
    const notValidatedIds = ids.filter(g => typeof map[g] === 'undefined');

    if (notValidatedIds.length <= 0) return;
    onValidatingStateChange(true);
    const response = await fetchApiChunked(endpoint, {
      headers: { 'Content-Type': 'application/json' },
      body: {
        size: notValidatedIds.length,
        fields: idFields.concat(extraFields).join(','),
        filters: makeFilter([
          {
            field: `${field}_autocomplete.lowercase`,
            value: notValidatedIds.map(s => s.toLowerCase()),
          },
        ]),
      },
    });
    notValidatedIds.forEach(g => (map[g] = map[g] || null));
    updateMap(map, idFields, response.data.hits);

    onValidatingStateChange(false);
  };
}
