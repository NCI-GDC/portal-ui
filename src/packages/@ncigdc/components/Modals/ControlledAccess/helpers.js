import React from 'react';

import { humanify } from '@ncigdc/utils/string';

import CAIconMessage from './CAIconMessage';

const stickyHeaderStyle = {
  thStyle: {
    position: 'sticky',
    top: 0,
  },
};

export const userAccessListStub = ['fm', 'genie'];

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
  studiesList,
  user,
  userAccessList,
}) => studiesList.map(datum => ({
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
  ...userAccessList.length > 0 && {
    select: userAccessList.includes(datum.program)
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
  },
}))
  .filter((datum, i) => !(user && studiesList[i].genes_mutations === 'in_process'));
