import _ from 'lodash';

import Consequence from './Consequence';

export const mapDonors = function(donors) {
  return donors.map((d) => {
    const output = {};

    const source = d.fields;

    source['summary.data_categories.data_category'].forEach((cat, i) => {
      output[cat] = source['summary.data_categories.file_count'][i];
    });

    return {
      ...output,
      id: (source['case_id'] || [])[0],
      gender: (source['demographic.gender'] || [])[0],
      race: (source['demographic.race'] || [])[0],
      ethnicity: (source['demographic.ethnicity'] || [])[0],
      age: (source['diagnoses.age_at_diagnosis'] || [])[0] || -777,
      vitalStatus: (source['diagnoses.vital_status'] || [])[0] === 'alive',
      daysToDeath: (source['diagnoses.days_to_death'] || [])[0] || -777,
      primaryDiagnosi: (source['diagnoses.primary_diagnosis'] || [])[0],
    };
  });
}

export const mapGenes = function(genes, curatedList) {
  return _.map(genes, (g) => {
    const fields = g.fields;

    return {
      id: g._id,
      symbol: fields.symbol,
      totalDonors: fields['case.case_id'].length,
      cgc: (fields.is_cancer_gene_census && fields.is_cancer_gene_census[0]) || false,
    };
  });
}

export const mapOccurences = function(occurrences, donors, genes) {
  const donorIds = _.map(donors, (g) => { return g.id; });
  const geneIds = _.map(genes, (d) => { return d.id; });

  const geneIdToSymbol = genes.reduce((obj, g) => ({ ...obj, [g.id]: g.symbol }), {});

  function validOnco(o) {
    return geneIds.indexOf(o.geneId) >= 0 && donorIds.indexOf(o.donorId) >= 0 && o.functionalImpact === 'HIGH';
  }

  function toOnco(o) {
    const source = o._source;
    return {
      // required
      id: source.ssm.ssm_id,
      donorId: source.case.case_id,
      geneId: o.geneId,
      consequence: o.consequence.consequence_type,

      // optional
      geneSymbol: geneIdToSymbol[o.geneId],
      functionalImpact: o.consequence.functionalImpact,
    };
  }

  return _(occurrences)
        .map(expandObs)
        .flatten()
        .map(toOnco)
        .filter(validOnco)
        .value();
}

function expandObs(o) {
  const expanded = [];
  const precedence = Consequence.precedence();

  const consequences = o._source.ssm.consequence
    .map(c => c.transcript)
    .sort((t) => {
      const index = precedence.indexOf(t.consequence_type);

      if (index === -1) {
        return precedence.length + 1;
      }

      return index;
    });

  _(consequences).forEach((consequence) => {
    const ret = _.clone(o);
    consequence = _.clone(consequence);
    consequence.functionalImpact = consequence.annotation.impact;
    ret.geneId = consequence.gene.gene_id;
    ret.functionalImpact = consequence.functionalImpact;
    ret.consequence = consequence;

    expanded.push(ret);
  }).value();

  return expanded;
}

export default {
    mapDonors,
    mapGenes,
    mapOccurences,
};
