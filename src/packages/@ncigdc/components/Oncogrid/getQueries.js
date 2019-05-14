/* @flow */
import {
  replaceFilters,
  makeFilter,
  getFilterValue,
  removeFilter,
} from '@ncigdc/utils/filters';
import memoize from 'memoizee';
import { fetchApi, fetchApiChunked } from '@ncigdc/utils/ajax';

async function getGenes({
  filters,
  size = 50,
}: {
  filters: Object,
  size: number,
}): Promise<Object> {
  const fields = ['gene_id', 'symbol', 'is_cancer_gene_census'];

  return fetchApi(
    `analysis/top_mutated_genes_by_project?size=${size}&fields=${fields.join()}${filters
      .content.length
      ? `&filters=${JSON.stringify(filters)}`
      : ''}`,
  );
}

async function getSSMOccurrences({ filters }): Promise<Object> {
  return fetchApiChunked('ssm_occurrences', {
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters,
      fields: [
        'ssm.consequence.transcript.consequence_type',
        'ssm.consequence.transcript.annotation.vep_impact',
        'ssm.consequence.transcript.is_canonical',
        'ssm.consequence.transcript.gene.gene_id',
        'ssm.ssm_id',
        'case.case_id',
      ].join(),
    },
  });
}

async function getCNVOccurrences({ filters }): Promise<Object> {
  return fetchApiChunked('cnv_occurrences', {
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters,
      fields: [
        'cnv_occurrence_id',
        'case.case_id',
        'cnv.consequence.gene.gene_id',
        'cnv.cnv_change',
      ].join(),
    },
  });
}

async function getCases({
  filters,
  size = 50,
}: {
  filters: Object,
  size: number,
}): Promise<Object> {
  return fetchApi('analysis/top_mutated_cases_by_gene', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters,
      size,
      fields: [
        'demographic.days_to_death',
        'diagnoses.age_at_diagnosis',
        'demographic.vital_status',
        'demographic.gender',
        'demographic.race',
        'demographic.ethnicity',
        'case_id',
        'submitter_id',
        'project.project_id',
        'summary.data_categories.file_count',
        'summary.data_categories.data_category',
      ].join(),
    },
  });
}

const NO_RESULT = {
  genes: [],
  ssm_occurrences: [],
  cases: [],
  totalCases: 0,
  cnv_occurrences: [],
};
async function getQueries({
  currentFilters,
  maxGenes,
  maxCases,
  currentCNVFilters,
  currentSSMFilters,
  rankOncoGridBy,
  heatMapMode,
}: {
  currentFilters: Object,
  maxGenes: number,
  maxCases: number,
  currentCNVFilters: Object,
  currentSSMFilters: Object,
  rankOncoGridBy: string,
  heatMapMode: boolean,
}): Promise<Object> {
  const geneFilters =
    rankOncoGridBy === 'ssm'
      ? replaceFilters(
          {
            op: 'and',
            content: [
              {
                op: 'NOT',
                content: {
                  field: 'ssms.consequence.transcript.annotation.vep_impact',
                  value: 'missing',
                },
              },
            ],
          },
          currentSSMFilters,
        )
      : currentCNVFilters;

  const { data: { hits: genes } } = await getGenes({
    filters: geneFilters,
    size: maxGenes,
  });

  if (!genes.length) return NO_RESULT;

  const geneIds = genes.map(gene => gene.gene_id);
  const caseFilters = replaceFilters(
    {
      op: 'and',
      content: [
        {
          op: 'in',
          content: { field: 'genes.gene_id', value: geneIds },
        },
      ],
    },
    geneFilters,
  );
  const {
    data: { hits: cases, pagination: { total: totalCases } },
  } = await getCases({
    filters: caseFilters,
    size: maxCases,
  });
  if (!totalCases) return NO_RESULT;

  const caseIds = cases.map(c => c.case_id);

  const ssmOccurrenceFilters = removeFilter(
    f => f.match(/^cnvs\./),
    replaceFilters(
      {
        op: 'and',
        content: [
          {
            op: 'in',
            content: { field: 'cases.case_id', value: caseIds },
          },
        ],
      },
      caseFilters,
    ),
  );

  const { data: { hits: ssm_occurrences } } = await getSSMOccurrences({
    filters: ssmOccurrenceFilters,
  });

  // remove ssm-specific filters because there is no ssm data in cnv_occurrence_centric
  const cnvOccurrenceFilters = removeFilter(
    f => f.match(/^ssms./),
    replaceFilters(
      currentCNVFilters,
      makeFilter([
        { field: 'cases.case_id', value: caseIds },
        { field: 'genes.gene_id', value: geneIds },
      ]),
    ),
  );

  let cnv_occurrences = [];
  let cnvChangeFilters = getFilterValue({
    currentFilters: cnvOccurrenceFilters.content,
    dotField: 'cnv.cnv_change',
  });
  if (cnvChangeFilters.content.value.length > 0 && !heatMapMode) {
    let cnv_data = await getCNVOccurrences({
      filters: cnvOccurrenceFilters,
    });
    cnv_occurrences = cnv_data.data.hits;
  }

  // front end filter is_canonical on REST endpoint instead of
  // graphql endpoint with inner hits query because
  // that is very slow for large size (might be because inner hits causes ES to fire secondary queries)
  const isCanonicalOccurrences = ssm_occurrences.map(occurrence => ({
    ...occurrence,
    ssm: {
      ...occurrence.ssm,
      consequence: ((occurrence.ssm || {}).consequence || []).filter(
        ({ transcript: { is_canonical } }) => is_canonical,
      ),
    },
  }));

  return {
    genes,
    ssm_occurrences: isCanonicalOccurrences,
    cnv_occurrences,
    cases,
    totalCases,
  };
}

export default memoize(getQueries, {
  promise: true,
  normalizer: args => JSON.stringify(args[0]),
  max: 10,
});
