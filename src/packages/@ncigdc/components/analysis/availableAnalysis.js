import React from 'react';

import Venn from '@ncigdc/components/Charts/Venn';
import SetOperations from './SetOperations';

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
        <Venn
          {...p}
          data={[1, 2, 3]}
          ops={[1, 2, 3, 4, 5, 6, 7]}
          width={65}
          height={70}
          radius={18}
        />
      </span>,
    description:
      'Display Venn diagram and find intersection or union, etc. of your sets of the same type.',
    demoData: null,
    setInstructions: 'Select 2 or 3 of the same set type',
    setDisabledMessage: ({ sets, type }) =>
      ['case', 'gene', 'ssm'].filter(t => t !== type).some(t => sets[t])
        ? 'Please choose only one type'
        : (sets[type] || []).length > 3
          ? `Please select two or three ${type} sets`
          : null,
    validateSets: sets => {
      const entries = Object.entries(sets);
      return (
        entries.length === 1 && // can only have one type
        // must have 2 or 3 sets selected
        (entries[0][1].length === 2 || entries[0][1].length === 3)
      );
    },
    ResultComponent: ({ sets }) => {
      const type = ['case', 'gene', 'ssm'].find(t => sets[t]);
      return (
        <SetOperations
          type={type}
          setIds={sets[type].map(id => `set_id:${id}`)}
        />
      );
    },
  },
];

export default availableAnalysis;
