/* @flow */
import { replaceFilters } from "@ncigdc/utils/filters";
import memoize from "memoizee";
import { fetchApi } from "@ncigdc/utils/ajax";

async function getGenes({
  currentFilters,
  size = 50
}: {
  currentFilters: Object,
  size: number
}): Promise<Object> {
  const fields = ["gene_id", "symbol", "is_cancer_gene_census"];

  return fetchApi(
    `analysis/top_mutated_genes_by_project?size=${size}&fields=${fields.join()}${currentFilters.content.length ? `&filters=${JSON.stringify(currentFilters)}` : ""}`
  );
}

const OCCURRENCE_CHUNK = 10000;
async function getOccurences(args: {
  geneIds: Array<string>,
  caseIds: Array<string>,
  currentFilters: Object,
  from?: number,
  hits?: Array<{}>
}): Promise<Object> {
  const { geneIds, caseIds, currentFilters, from = 0, hits = [] } = args;

  if (!geneIds.length || !caseIds.length) return { data: { hits } };

  const filters = replaceFilters(
    {
      op: "and",
      content: [
        { op: "in", content: { field: "genes.gene_id", value: geneIds } },
        { op: "in", content: { field: "cases.case_id", value: caseIds } }
      ]
    },
    currentFilters
  );

  const fields = [
    "ssm.consequence.transcript.consequence_type",
    "ssm.consequence.transcript.annotation.impact",
    "ssm.consequence.transcript.gene.gene_id",
    "ssm.ssm_id",
    "case.case_id"
  ];

  const { data } = await fetchApi("ssm_occurrences", {
    headers: { "Content-Type": "application/json" },
    body: {
      filters,
      size: OCCURRENCE_CHUNK,
      from,
      fields: fields.join(),
      sort: "_uid" // force consistent order
    }
  });

  if (from + OCCURRENCE_CHUNK < data.pagination.total) {
    return getOccurences({
      ...args,
      from: from + OCCURRENCE_CHUNK,
      hits: [...hits, ...data.hits]
    });
  }

  return {
    data: {
      hits: [...hits, ...data.hits]
    }
  };
}

async function getCases({
  geneIds,
  currentFilters,
  size = 50
}: {
  geneIds: Array<string>,
  currentFilters: Object,
  size: number
}): Promise<Object> {
  if (!geneIds.length) return { data: { hits: [] } };

  const filters = replaceFilters(
    {
      op: "and",
      content: [
        { op: "in", content: { field: "genes.gene_id", value: geneIds } }
      ]
    },
    currentFilters
  );

  return fetchApi("analysis/top_mutated_cases_by_gene", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      filters,
      size,
      fields: [
        "diagnoses.days_to_death",
        "diagnoses.age_at_diagnosis",
        "diagnoses.vital_status",
        "demographic.gender",
        "demographic.race",
        "demographic.ethnicity",
        "case_id",
        "summary.data_categories.file_count",
        "summary.data_categories.data_category"
      ].join()
    }
  });
}

async function getQueries({
  currentFilters,
  maxGenes,
  maxCases
}: {
  currentFilters: Object,
  maxGenes: number,
  maxCases: number
}): Promise<Object> {
  const { data } = await getGenes({ currentFilters, size: maxGenes });
  const genes = data.hits;
  const geneIds = genes.map(gene => gene.gene_id);
  const cases = await getCases({ geneIds, currentFilters, size: maxCases });
  const caseIds = cases.data.hits.map(c => c.case_id);
  const occurrences = await getOccurences({ geneIds, currentFilters, caseIds });

  return {
    genes,
    occurences: occurrences.data.hits,
    cases: cases.data.hits,
    totalCases: cases.data.pagination.total
  };
}

export default memoize(getQueries, {
  promise: true,
  normalizer: args => JSON.stringify(args[0]),
  max: 10
});
