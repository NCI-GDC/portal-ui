/* @flow */
function getQueries({
  projectId,
  api,
  consequenceTypes,
}: {
  projectId: string,
  api: string,
  consequenceTypes: Array<string>,
}) {
  const urlBase = `${api}/analysis/oncogrid/`;
  const consequenceParam = `consequence_type=${consequenceTypes.join(',')}`;
  const projectParam = `project_id=${projectId}`;
  const geneQuery = `${urlBase}genes?${projectParam}&${consequenceParam}&fields=${
    [
      'gene_id',
      'case.case_id',
      'symbol',
      'is_cancer_gene_census',
    ].join()
  }`;

  return fetch(geneQuery)
    .then(r => r.json())
    .then(({ data }) => {
      const genes = data.hits;
      const geneParam = `gene_id=${genes.map(gene => gene.gene_id).join(',')}`;

      const occurenceQuery = `${urlBase}occurences?${projectParam}&${consequenceParam}&${geneParam}&fields=${
        [
          'ssm.consequence.transcript.consequence_type',
          'ssm.consequence.transcript.annotation.impact',
          'ssm.consequence.transcript.gene.gene_id',
          'ssm.ssm_id',
          'case.case_id',
        ].join()
      }`;

      const caseQuery = `${urlBase}cases?${projectParam}&${geneParam}&fields=${
        [
          'diagnoses.days_to_death',
          'diagnoses.age_at_diagnosis',
          'diagnoses.vital_status',
          'diagnoses.primary_diagnosis',
          'demographic.gender',
          'demographic.race',
          'demographic.ethnicity',
          'case_id',
          'summary.data_categories.file_count',
          'summary.data_categories.data_category',
        ].join()
      }`;

      return Promise.all([
        fetch(occurenceQuery).then(r => r.json()),
        fetch(caseQuery).then(r => r.json()),
      ]).then(d => ({
        genes,
        occurences: d[0].data.hits,
        cases: d[1].data.hits,
      }));
    });
}

export default getQueries;
