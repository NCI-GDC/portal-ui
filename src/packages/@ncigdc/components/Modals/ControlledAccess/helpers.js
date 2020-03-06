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

export const getHeadings = ({ isAuth, userAccessList }) => ([
  ...isAuth &&
    userAccessList.length > 0 &&
    [
      {
        key: 'select',
        title: 'Select',
      },
    ],
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
]).map(heading => ({
  ...heading,
  ...stickyHeaderStyle,
}));

export const dataStub = [
  {
    genes_mutations: 'controlled',
    program: 'genie',
  },
  {
    genes_mutations: 'controlled',
    program: 'fm',
  },
  {
    genes_mutations: 'open',
    program: 'tcga',
  },
  {
    program: 'target',
  },
  {
    program: 'mmrf',
  },
  {
    program: 'cptac',
  },
  {
    program: 'beataml 1.0',
  },
  {
    program: 'nciccr',
  },
  {
    program: 'ohu',
  },
  {
    program: 'cgci',
  },
  {
    program: 'wcdt',
  },
  {
    program: 'organoid',
  },
  {
    program: 'ctsp',
  },
  {
    program: 'hcmi',
  },
  {
    program: 'varpop',
  },
]
  .map(stub => ({
    ...stub,
    cases_clinical: 'open',
    genes_mutations: stub.genes_mutations || 'not_available',
  }));

export const formatData = ({
  data,
  handleProgramSelect,
  isAuth,
  selectedModalPrograms,
  userCAPrograms,
}) => data.map(datum => ({
  ...datum,
  cases_clinical: humanify({ term: datum.cases_clinical }),
  genes_mutations: datum.genes_mutations === 'controlled'
    ? isAuth
      ? userCAPrograms.includes(datum.program)
        ? (
          <CAIconMessage faClass="fa-check">
            You have access
          </CAIconMessage>
        )
        : (
          <CAIconMessage faClass="fa-lock">
            Controlled. Please
            {' '}
            <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data" target="_blank">apply for access</a>
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
  ...userCAPrograms.length > 0 && {
    select: userCAPrograms.includes(datum.program)
      ? (
        <input
          checked={selectedModalPrograms.includes(datum.program)}
          name="controlled-access-programs"
          onChange={handleProgramSelect}
          type="radio"
          value={datum.program}
          />
      )
      : ' ',
  },
}))
  .filter((datum, i) => !(isAuth &&
      data[i].genes_mutations === 'not_available'));
