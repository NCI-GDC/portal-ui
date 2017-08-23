import React from 'react';

import { GridIcon } from '@ncigdc/theme/icons';
import OncoGridWrapper from '@ncigdc/components/Oncogrid/OncogridWrapper';

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
];

export default availableAnalysis;
