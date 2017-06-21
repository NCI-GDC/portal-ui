/* @flow */
import { replaceFilters } from '@ncigdc/utils/filters';
import memoize from 'memoizee';
import { fetchApi } from '@ncigdc/utils/ajax';
import Queue from 'queue';
import md5 from 'blueimp-md5';

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

const OCCURRENCE_CHUNK = 10000;
async function getOccurrences(args: { filters: Object }): Promise<Object> {
  const queue = Queue({ concurrency: 6 });
  const fields = [
    'ssm.consequence.transcript.consequence_type',
    'ssm.consequence.transcript.annotation.impact',
    'ssm.consequence.transcript.gene.gene_id',
    'ssm.ssm_id',
    'case.case_id',
  ];

  const firstSize = 0;
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    body: {
      filters: args.filters,
      size: firstSize,
      from: 0,
      fields: fields.join(),
      sort: '_uid', // force consistent order
    },
  };
  const hash = md5(JSON.stringify(defaultOptions));
  const { data } = await fetchApi(`ssm_occurrences?hash=${hash}`, {
    ...defaultOptions,
  });
  let hits = data.hits;

  for (
    let count = firstSize;
    count < data.pagination.total;
    count += OCCURRENCE_CHUNK
  ) {
    // eslint-disable-next-line no-loop-func
    queue.push(callback => {
      const options = {
        ...defaultOptions,
        body: {
          ...defaultOptions.body,
          from: count,
          size: OCCURRENCE_CHUNK,
        },
      };
      const hash = md5(JSON.stringify(options));
      fetchApi(`ssm_occurrences?hash=${hash}`, options).then(response => {
        hits = [...hits, ...response.data.hits];
        callback();
      });
    });
  }

  return new Promise((resolve, reject) => {
    queue.start(err => {
      if (err) {
        reject(err);
      } else {
        resolve({ data: { hits } });
      }
    });
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

  return {
    genes,
    occurrences,
    cases,
    totalCases,
  };
}

export default memoize(getQueries, {
  promise: true,
  normalizer: args => JSON.stringify(args[0]),
  max: 10,
});
