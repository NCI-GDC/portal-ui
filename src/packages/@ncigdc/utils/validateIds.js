import { fetchApiChunked } from '@ncigdc/utils/ajax';

const FETCH_ALL_GENES = process.env.NODE_ENV !== 'test';

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
let allGenePromise =
  FETCH_ALL_GENES &&
  fetchApiChunked('genes', {
    headers: { 'Content-Type': 'application/json' },
    body: {
      fields: GENE_ID_FIELDS.join(','),
    },
  }).then(response => {
    updateMap(geneMap, GENE_ID_FIELDS, response.data.hits);
  });
export const validateGenes = validate({
  idFields: GENE_ID_FIELDS,
  map: geneMap,
  field: 'gene',
  endpoint: 'genes',
  dataPromise: allGenePromise,
});

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
export const validateCases = validate({
  idFields: CASE_ID_FIELDS,
  map: caseMap,
  field: 'case',
  endpoint: 'cases',
  extraFields: ['project.project_id'],
});

function validate({
  idFields,
  map,
  field,
  endpoint,
  extraFields = [],
  dataPromise,
}) {
  return async (ids = [], onValidatingStateChange) => {
    const notValidatedIds = ids.filter(g => typeof map[g] === 'undefined');
    if (notValidatedIds.length <= 0) return;
    onValidatingStateChange(true);
    if (!dataPromise) {
      const response = await fetchApiChunked(endpoint, {
        headers: { 'Content-Type': 'application/json' },
        body: {
          size: notValidatedIds.length,
          fields: idFields.concat(extraFields).join(','),
          filters: {
            op: 'IN',
            content: {
              field: `${field}_autocomplete.lowercase`,
              value: notValidatedIds.map(s => s.toLowerCase()),
            },
          },
        },
      });
      notValidatedIds.forEach(g => (map[g] = map[g] || null));
      updateMap(map, idFields, response.data.hits);
    } else {
      await dataPromise;
      notValidatedIds.forEach(g => (map[g] = map[g] || null));
    }

    onValidatingStateChange(false);
  };
}
