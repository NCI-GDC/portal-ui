import React from 'react';

import { GridIcon } from '@ncigdc/theme/icons';
import Venn from '@ncigdc/components/Charts/Venn';
// import OncoGridWrapper from '@ncigdc/components/Oncogrid/OncogridWrapper';
import SetOperations from './SetOperations';
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
    type: 'set_operations',
    title: 'Set Operations',
    Icon: p =>
      <span style={{ marginRight: 25, marginLeft: -10 }}>
        <Venn {...p} data={[1, 2, 3]} width={65} height={70} radius={18} />
      </span>,
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    demoData: {
      // id: 'demo-oncogrid',
      // sets: { case: ['AV4LfE0RtAqwfvhAJ7wC'], gene: ['AV4LNdQwLqCe7fg6V8DU'] }, // TODO: setIds will change, need way to generate or store these.
      // type: 'oncogrid',
      // created: new Date().toISOString(),
    },
    setInstructions: 'Select 2 or 3 of the same set type',
    setDisabledMessage: ({ sets, type }) =>
      ['case', 'gene'].filter(t => t !== type).some(t => sets[t])
        ? 'Please choose only one type'
        : (sets[type] || []).length > 3
          ? `Please select two or three ${type} sets`
          : null,
    validateSets: sets => {
      const entries = Object.entries(sets);
      console.log(entries);
      return true;
    },
    ResultComponent: ({ sets }) => {
      const type = ['case', 'gene'].find(t => sets[t]);
      return (
        <SetOperations
          type={type}
          setIds={sets[type].map(id => `set_id:${id}`)}
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
