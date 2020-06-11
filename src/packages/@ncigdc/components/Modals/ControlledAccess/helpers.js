import React from 'react';
import { flatten } from 'lodash';

import { humanify } from '@ncigdc/utils/string';

import CAIconMessage from './CAIconMessage';

const stickyHeaderStyle = {
  thStyle: {
    position: 'sticky',
    top: 0,
  },
};

export const getHeadings = ({ user }) => ([
  ...user
      ? [
        {
          key: 'select',
          title: 'Select',
        },
      ]
      : [],
  {
    key: 'program',
    title: 'Program',
  },
  {
    key: 'cases_clinical',
    title: 'Cases & Clinical',
  },
  {
    key: 'genes_mutations',
    title: 'Genes & Mutations',
  },
].map(heading => ({
  ...heading,
  ...stickyHeaderStyle,
})));

export const formatData = ({
  handleProgramSelect,
  selectedStudies,
  studiesSummary,
  user,
  userAccessList,
}) => flatten(Object.values(
  user && userAccessList.length > 0
  ? {
    ...studiesSummary,
    controlled: studiesSummary.controlled
      .sort(study => -(userAccessList.includes(study.program))),
  }
  : studiesSummary,
))
  .filter(datum => user || datum.genes_mutations !== 'in_process')
  .map(datum => ({
    ...datum,
    cases_clinical: humanify({ term: datum.cases_clinical }),
    genes_mutations: datum.genes_mutations === 'controlled'
      ? user
        ? userAccessList.includes(datum.program)
          ? (
            <CAIconMessage faClass="fa-check">
              You have access
            </CAIconMessage>
          )
          : (
            <CAIconMessage faClass="fa-lock">
              {'Controlled. '}
              <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data" rel="noopener noreferrer" target="_blank">Apply for access</a>
              .
            </CAIconMessage>
          )
        : (
          <CAIconMessage faClass="fa-lock">
            Controlled
          </CAIconMessage>
        )
      : humanify({ term: datum.genes_mutations }),
    program: datum.program.toUpperCase(),
    select: userAccessList.length > 0 && userAccessList.includes(datum.program)
      ? (
        <input
          checked={selectedStudies.includes(datum.program)}
          name="controlled-access-programs"
          onChange={handleProgramSelect}
          type="radio"
          value={datum.program}
          />
      )
      : ' ',
  }));
