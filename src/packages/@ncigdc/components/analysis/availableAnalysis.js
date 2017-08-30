import React from 'react';

import { GridIcon } from '@ncigdc/theme/icons';
import OncoGridWrapper from '@ncigdc/components/Oncogrid/OncogridWrapper';
import CohortComparison from '@ncigdc/modern_components/CohortComparison';

type TSelectedSets = {
  [string]: Array<string>,
};

type TAnalysis = {|
  type: string,
  title: string,
  Icon: ReactComponent<*>,
  description: string,
  demoData: {|
    id: string,
    sets: TSelectedSets,
    type: string,
    created: string,
  |},
  setInstructions: string,
  setDisabledMessage: ({ sets: TSelectedSets, type: string }) => ?string,
  validateSets: TSelectedSets => boolean,
  ResultComponent: ReactComponent<*>,
|};

const availableAnalysis: Array<TAnalysis> = [
  {
    type: 'oncogrid',
    title: 'OncoGrid',
    Icon: GridIcon,
    description: 'Visualize genetic alterations affecting a set of donors.',
    demoData: {
      id: 'demo-oncogrid',
      sets: { case: ['AV4LfE0RtAqwfvhAJ7wC'], gene: ['AV4LNdQwLqCe7fg6V8DU'] }, // TODO: setIds will change, need way to generate or store these.
      type: 'oncogrid',
      created: new Date().toISOString(),
    },
    setInstructions: 'Select 1 case set and one gene set',
    setDisabledMessage: ({ sets, type }) =>
      !['case', 'gene'].includes(type)
        ? "This analysis can't be run with this type"
        : (sets[type] || []).length
          ? `You can only select one ${type} set`
          : null,
    validateSets: sets =>
      ['case', 'gene'].every((t: any) => (sets[t] || []).length === 1),
    ResultComponent: ({ sets }) => {
      return (
        <OncoGridWrapper
          currentFilters={{
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: 'genes.gene_id',
                  value: sets.gene.map(id => `set_id:${id}`),
                },
              },
              {
                op: 'in',
                content: {
                  field: 'cases.case_id',
                  value: sets.case.map(id => `set_id:${id}`),
                },
              },
            ],
          }}
        />
      );
    },
  },
  {
    type: 'comparison',
    title: 'Cohort Comparison',
    Icon: GridIcon,
    description: 'Cohort Comparison.',
    demoData: {
      id: 'demo-comparison',
      sets: { case: ['AV4vM4A6k-Uw42heedhg', 'AV4vM8MJk-Uw42heedhh'] }, // TODO: setIds will change, need way to generate or store these.
      type: 'comparison',
      created: new Date().toISOString(),
    },
    setInstructions: 'Select 2 case sets',
    setDisabledMessage: ({ sets, type }) =>
      !['case'].includes(type)
        ? "This analysis can't be run with this type"
        : (sets[type] || []).length >= 2
          ? `You can only select two ${type} set`
          : null,
    validateSets: sets =>
      ['case'].every((t: any) => (sets[t] || []).length === 2),
    ResultComponent: ({ sets }) => {
      return (
        <CohortComparison
          facets={[
            'demographic.gender',
            'diagnoses.vital_status',
            'demographic.race',
          ]}
          set1={sets.case[0]}
          set2={sets.case[1]}
        />
      );
    },
  },
];

export default availableAnalysis;
