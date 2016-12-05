import _ from 'lodash';

import Consequence from './Consequence';

export const mapDonors = function(donors) {
  return donors.map((d) => {
    const { summary, demographic, case_id, diagnoses = [] } = d._source;
    const {
      age_at_diagnosis = -777,
      vital_status,
      days_to_death = -777,
      primary_diagnosis,
    } = diagnoses[0];

    const output = {};

    summary.data_categories.forEach((category) => {
      output[category.data_category] = category.file_count;
    });

    return {
      ...output,
      id: case_id,
      gender: demographic.gender,
      race: demographic.race,
      ethnicity: demographic.ethnicity,
      age: age_at_diagnosis,
      vitalStatus: vital_status === 'alive',
      daysToDeath: days_to_death,
      primaryDiagnosi: primary_diagnosis,
    };
  });
};

export const mapGenes = function(genes) {
  return _.map(genes, (g) => {
    const source = g._source;

    return {
      id: g._id,
      symbol: source.symbol,
      totalDonors: source.case.length,
      cgc: source.is_cancer_gene_census,
    };
  });
};

export const mapOccurences = function(occurrences, donors, genes, consequenceTypes) {
  const donorIds = donors.map(d => d.id);
  const geneIds = genes.map(g => g.id);
  const geneIdToSymbol = genes.reduce((acc, g) => ({ ...acc, [g.id]: g.symbol }), {});

  function validOnco(occurrence) {
    return (
      (!consequenceTypes || consequenceTypes.indexOf(occurrence.consequence) >= 0) &&
      geneIds.indexOf(occurrence.geneId) >= 0 &&
      donorIds.indexOf(occurrence.donorId) >= 0 &&
      occurrence.functionalImpact === 'HIGH'
    );
  }

  return _(occurrences)
    .map(expandObs(geneIdToSymbol))
    .flatten()
    .filter(validOnco)
    .value();
};

function expandObs(geneIdToSymbol) {
  return (occurrence) => {
    const { ssm, case: casObj = {}} = occurrence._source;

    return ssm.consequence
      .map(c => c.transcript)
      .map((consequence) => {
        const { annotation = {}, gene = {}, consequence_type } = consequence;
        const geneId = gene.gene_id;

        return {
          // required
          id: ssm.ssm_id,
          donorId: casObj.case_id,
          geneId,
          consequence: consequence_type,

          // optional
          geneSymbol: geneIdToSymbol[geneId],
          functionalImpact: annotation.impact,
        };
      });
  };
}

export default {
    mapDonors,
    mapGenes,
    mapOccurences,
};
