/* @flow */
export type TDonorInput = {
  _source: {
    summary: {
      data_categories: Array<{data_category: string, file_count: number}>,
    },
    demographic: {
      gender: string,
      race: string,
      ethnicity: string,
    },
    case_id: string,
    diagnoses: Array<{
      age_at_diagnosis: number,
      vital_status: string,
      days_to_death: number,
      primary_diagnosis: string,
    }>,
  },
};

export type TDonor = {
  id: string,
  gender: string,
  race: string,
  ethnicity: string,
  age: number,
  vitalStatus: boolean,
  daysToDeath: number,
  primaryDiagnosi: string,
};

export const mapDonors = (donors: Array<TDonorInput>): Array<TDonor> => {
  return donors.map(({ _source }: TDonorInput): TDonor => {
    const { summary, demographic, case_id, diagnoses = [] } = _source;
    const { gender, race, ethnicity } = demographic;
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
      gender,
      race,
      ethnicity,
      age: age_at_diagnosis,
      vitalStatus: vital_status === 'alive',
      daysToDeath: days_to_death,
      primaryDiagnosi: primary_diagnosis,
    };
  });
};

export type TGeneInput = {
  _id: string,
  _source: {
    symbol: string,
    case: Array<{}>,
    is_cancer_gene_census: boolean,
  },
};

export type TGene = {
  id: string,
  symbol: string,
  totalDonors: number,
  cgc: boolean,
};

export const mapGenes = (genes: Array<TGeneInput>): Array<TGene> => (
  genes.map(({ _id, _source }: TGeneInput): TGene => ({
    id: _id,
    symbol: _source.symbol,
    totalDonors: _source.case.length,
    cgc: _source.is_cancer_gene_census,
  }))
);

export type TOccurenceInput = {
  _source: {
    ssm: {
      ssm_id: string,
      consequence: Array<{
        transcript: {
          consequence_type: string,
          gene: {
            gene_id: string,
          },
          annotation: {
            impact: string,
          },
        }}>,
    },
    case: {
      case_id: string,
    },
  },
};

export type TOccurence = {
  id: string,
  donorId: string,
  geneId: string,
  consequence: string,
  geneSymbol: string,
  functionalImpact: string,
};

function expandObs(geneIdToSymbol) {
  return (occurrence: TOccurenceInput): Array<TOccurence> => {
    const { ssm, case: casObj = {} } = occurrence._source;

    return ssm.consequence
      .map(c => c.transcript)
      .map((consequence): TOccurence => {
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

export const mapOccurences = (
  occurrences: Array<TOccurenceInput>,
  donors: Array<TDonor>,
  genes: Array<TGene>,
  consequenceTypes: Array<string>
): Array<TOccurence> => {
  const donorIds: Array<string> = donors.map((d: TDonor): string => d.id);
  const geneIds: Array<string> = genes.map((g: TGene): string => g.id);
  const geneIdToSymbol = genes.reduce((acc, g: TGene) => ({ ...acc, [g.id]: g.symbol }), {});

  function validOnco(occurrence: TOccurence) {
    return (
      (!consequenceTypes || consequenceTypes.indexOf(occurrence.consequence) >= 0) &&
      geneIds.indexOf(occurrence.geneId) >= 0 &&
      donorIds.indexOf(occurrence.donorId) >= 0 &&
      occurrence.functionalImpact === 'HIGH'
    );
  }

  return occurrences.map(expandObs(geneIdToSymbol))
    .reduce((acc, occurrence) => [...acc, ...occurrence])
    .filter(validOnco);
};

export default { mapDonors, mapGenes, mapOccurences };
