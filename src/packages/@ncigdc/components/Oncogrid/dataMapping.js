/* @flow */
import { dataTypeTracks } from './tracks';
import _ from 'lodash';

const dataTypesInitial = dataTypeTracks.reduce(
  (acc, d) => ({ ...acc, [d.fieldName]: 0 }),
  {},
);

export type TDonorInput = {
  summary: {
    data_categories: Array<{ data_category: string, file_count: number }>,
  },
  demographic: {
    gender: string,
    race: string,
    ethnicity: string,
  },
  case_id: string,
  project: {
    project_id: string,
  },
  submitter_id: string,
  diagnoses: Array<{
    age_at_diagnosis: number,
    vital_status: string,
    days_to_death: number,
    primary_diagnosis: string,
  }>,
};

export type TDonor = {
  id: string,
  gender: string,
  race: string,
  ethnicity: string,
  age: number,
  vitalStatus: 'not reported' | 'alive' | 'dead',
  daysToDeath: number,
};

function nullSentinel(value: ?number): number {
  if (value || value === 0) return value;
  return -777;
}

type TMapDonors = (
  donors: Array<TDonorInput>,
  donorIds: Set<string>,
) => Array<TDonor>;
export const mapDonors: TMapDonors = (donors, donorIds) => {
  const arr = [];

  for (let i = 0; i < donors.length; i += 1) {
    const {
      summary: { data_categories },
      demographic = {},
      case_id,
      diagnoses = [],
      project: { project_id },
      submitter_id,
    } = donors[i];

    if (donorIds.has(case_id)) {
      const {
        gender,
        race = 'not reported',
        ethnicity = 'not reported',
      } = demographic;
      const {
        age_at_diagnosis,
        vital_status: vitalStatus = 'not reported',
        days_to_death,
      } =
        diagnoses[0] || {};

      const output = {
        ...dataTypesInitial,
        id: case_id,
        gender,
        race,
        ethnicity,
        age: nullSentinel(age_at_diagnosis),
        vitalStatus,
        daysToDeath: nullSentinel(days_to_death),
        displayId: `${project_id} / ${submitter_id}`,
      };

      for (let j = 0; j < data_categories.length; j += 1) {
        const category = data_categories[j];
        output[category.data_category] = category.file_count || 0;
      }

      arr.push(output);
    }
  }

  return arr;
};

export type TGeneInput = {
  gene_id: string,
  symbol: string,
  _score: number,
  is_cancer_gene_census: boolean,
};

export type TGene = {
  id: string,
  symbol: string,
  totalDonors: number,
  cgc: boolean,
};

type TMapGenes = (
  genes: Array<TGeneInput>,
  geneIds: Set<string>,
) => Array<TGene>;
export const mapGenes: TMapGenes = (genes, geneIds) => {
  const arr = [];

  for (let i = 0; i < genes.length; i += 1) {
    const { gene_id, symbol, _score, is_cancer_gene_census: cgc } = genes[i];
    if (geneIds.has(gene_id)) {
      arr.push({
        id: gene_id,
        symbol,
        totalDonors: _score,
        cgc: !!cgc,
      });
    }
  }

  return arr;
};

export type TOccurrenceInput = {
  ssm: {
    ssm_id: string,
    consequence: Array<{
      transcript: {
        consequence_type: string,
        gene: {
          gene_id: string,
        },
        annotation: {
          vep_impact: string,
        },
      },
    }>,
  },
  case: {
    case_id: string,
  },
};

export type TOccurrence = {
  id: string,
  donorId: string,
  geneId: string,
  consequence: string,
  geneSymbol: string,
  functionalImpact: string,
};

type TBuildOccurrences = (
  occurrences: Array<TOccurrenceInput>,
  donors: Array<TDonorInput>,
  genes: Array<TGeneInput>,
  consequenceTypes: Array<string>,
  impacts: Array<string>,
) => {
  observations: Array<TOccurrence>,
  donorIds: Set<string>,
  geneIds: Set<string>,
};
export const buildOccurrences: TBuildOccurrences = (
  occurrences,
  donors,
  genes,
  consequenceTypes = [],
  impacts,
  cnv_occurrences,
) => {
  const allowedCaseIds = new Set();
  for (let i = 0; i < donors.length; i += 1) {
    allowedCaseIds.add(donors[i].case_id);
  }

  const geneIdToSymbol = {};
  for (let i = 0; i < genes.length; i += 1) {
    const gene = genes[i];
    geneIdToSymbol[gene.gene_id] = gene.symbol;
  }

  let observations = [];
  const donorIds = new Set();
  const geneIds = new Set();
  let cnvObservations = [];
  for (let i = 0; i < occurrences.length; i += 1) {
    const {
      ssm: { consequence, ssm_id },
      case: { case_id } = {},
    } = occurrences[i];

    if (allowedCaseIds.has(case_id)) {
      for (let j = 0; j < consequence.length; j += 1) {
        const { transcript } = consequence[j];
        const {
          annotation: { vep_impact } = {},
          gene: { gene_id } = {},
          consequence_type,
        } = transcript;
        const geneSymbol = geneIdToSymbol[gene_id];

        if (
          vep_impact &&
          geneSymbol &&
          consequenceTypes.includes(consequence_type) &&
          (!impacts.length || impacts.includes(vep_impact))
        ) {
          donorIds.add(case_id);
          geneIds.add(gene_id);

          let match = _.findIndex(
            observations,
            o =>
              o.donorId === case_id &&
              o.geneId === gene_id &&
              o.consequence === consequence_type,
          );
          if (match > -1) {
            observations[match].ids.push(ssm_id);
          } else {
            observations.push({
              // required
              ids: [ssm_id],
              donorId: case_id,
              geneId: gene_id,
              consequence: consequence_type,
              type: 'mutation',

              // optional
              geneSymbol,
              functionalImpact: vep_impact,
            });
          }
        }
      }
    }
  }

  for (let i = 0; i < cnv_occurrences.length; i += 1) {
    const { cnv_id, cnv_change, score, gene_id, case_id } = cnv_occurrences[i];
    if (allowedCaseIds.has(case_id)) {
      if (score !== 0 && gene_id) {
        donorIds.add(case_id);
        geneIds.add(gene_id);
        cnvObservations.push({
          ids: [cnv_id],
          donorId: case_id,
          geneId: gene_id,
          geneSymbol: geneIdToSymbol[gene_id],
          cnv_change,
          type: 'cnv',
        });
      }
    }
  }

  return {
    observations,
    donorIds,
    geneIds,
    cnvObservations,
  };
};

export default { mapDonors, mapGenes, buildOccurrences };
