/* @flow */
import { replaceFilters } from '@ncigdc/utils/filters';
import _ from 'lodash';
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

async function getOccurrences({ filters }): Promise<Object> {
  return fetchApiChunked('ssm_occurrences', {
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters,
      fields: [
        'ssm.consequence.transcript.consequence_type',
        'ssm.consequence.transcript.annotation.impact',
        'ssm.consequence.transcript.gene.gene_id',
        'ssm.ssm_id',
        'case.case_id',
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
        'diagnoses.days_to_death',
        'diagnoses.age_at_diagnosis',
        'diagnoses.vital_status',
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

const NO_RESULT = { genes: [], occurrences: [], cases: [], totalCases: 0 };
async function getQueries({
  currentFilters,
  maxGenes,
  maxCases,
}: {
  currentFilters: Object,
  maxGenes: number,
  maxCases: number,
}): Promise<Object> {
  const geneFilters = replaceFilters(
    {
      op: 'and',
      content: [
        {
          op: 'NOT',
          content: {
            field: 'ssms.consequence.transcript.annotation.impact',
            value: 'missing',
          },
        },
      ],
    },
    currentFilters,
  );
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
  const occurrenceFilters = replaceFilters(
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
  );
  const { data: { hits: occurrences } } = await getOccurrences({
    filters: occurrenceFilters,
  });

  const caseUUIDMap = _.mapValues(_.groupBy(cases, 'case_id'), ([donor]) => ({
    ...donor,
    uuid: donor.case_id,
    slug: `${donor.project.project_id} / ${donor.submitter_id}`,
  }));
  const caseSlugMap = _.mapKeys(caseUUIDMap, donor => donor.slug);

  const massagedCases = cases.map(donor => ({
    ...donor,
    uuid: donor.case_id,
    case_id: caseUUIDMap[donor.case_id].slug,
  }));

  const massagedOccurrences = occurrences.map(occurrence => ({
    ...occurrence,
    case: {
      case_id: caseUUIDMap[occurrence.case.case_id].slug,
    },
  }));

  return {
    genes,
    occurrences: massagedOccurrences,
    cases: massagedCases,
    totalCases,
    caseSlugMap,
  };
}

export default memoize(getQueries, {
  promise: true,
  normalizer: args => JSON.stringify(args[0]),
  max: 10,
});
