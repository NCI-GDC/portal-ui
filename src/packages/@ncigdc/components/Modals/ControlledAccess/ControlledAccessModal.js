// @flow
import React from 'react';
import { connect } from 'react-redux';
import {
  compose, withState,
} from 'recompose';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import Button from '@ncigdc/uikit/Button';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { humanify } from '@ncigdc/utils/string';

import CAMessage from './CAMessage';
import CADevControls from './CADevControls';
import { dataStub, getHeadings } from './helpers';
import CAIconMessage from './CAIconMessage';

const enhance = compose(
  connect(state => ({
    user: state.auth.user,
  })),
  withState('isFakeLoggedIn', 'setIsFakeLoggedIn', false),
  withState('showDevControls', 'setShowDevControls', false),
  withState('userAccessList', 'setUserAccessList', []),
);

const ControlledAccessModal = ({
  closeText = 'Close',
  isFakeLoggedIn,
  setIsFakeLoggedIn,
  setShowDevControls,
  setUserAccessList,
  showDevControls,
  user,
  userAccessList,
}) => {
  const isAuth = user || isFakeLoggedIn;
  const controlledProgramsWithAccess = dataStub
    .filter(datum => datum.genes_mutations === 'controlled')
    .filter(datum => userAccessList.includes(datum.program))
    .map(datum => datum.program);

  const dataFormatted = dataStub.map(datum => ({
    ...datum,
    cases_clinical: humanify({ term: datum.cases_clinical }),
    genes_mutations: datum.genes_mutations === 'controlled'
      ? isAuth
        ? controlledProgramsWithAccess.includes(datum.program)
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
    ...controlledProgramsWithAccess.length > 0 && {
      select: controlledProgramsWithAccess.includes(datum.program)
        ? <input name="controlled-access-programs" type="radio" val={datum.program} />
        : ' ',
    },
  }))
    .filter((datum, i) => !(isAuth &&
      dataStub[i].genes_mutations === 'not_available'));

  return (
    <BaseModal
      closeText={closeText}
      extraButtons={isAuth
        ? <Button>Explore</Button>
        : (
          <LoginButton keepModalOpen>
            <Button>Login</Button>
          </LoginButton>
      )}
      title="Explore Controlled & Open Data"
      >
      <CADevControls
        isFakeLoggedIn={isFakeLoggedIn}
        setIsFakeLoggedIn={setIsFakeLoggedIn}
        setShowDevControls={setShowDevControls}
        setUserAccessList={setUserAccessList}
        showDevControls={showDevControls}
        userAccessList={userAccessList}
        />
      <CAMessage isAuth={isAuth} userAccessList={userAccessList} />
      <EntityPageHorizontalTable
        data={dataFormatted}
        headings={getHeadings({
          isAuth,
          userAccessList,
        })}
        tableContainerStyle={{ maxHeight: 300 }}
        tableId="controlled-access-table"
        />
    </BaseModal>
  );
};

export default enhance(ControlledAccessModal);
