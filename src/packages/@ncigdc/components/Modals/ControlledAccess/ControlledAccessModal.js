// @flow
import React from 'react';
import {
  compose, lifecycle, withHandlers, withState,
} from 'recompose';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import Button from '@ncigdc/uikit/Button';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { setModal } from '@ncigdc/dux/modal';

import CAMessage from './CAMessage';
import CADevControls from './CADevControls';
import { dataStub as data, getHeadings, formatData } from './helpers';

const enhance = compose(
  withState('selectedModalPrograms', 'setSelectedModalPrograms', []),
  // START temporary UI dev props. update when APIs are available.
  withState('isFakeLoggedIn', 'setIsFakeLoggedIn', false),
  withState('showDevControls', 'setShowDevControls', false),
  withState('userAccessList', 'setUserAccessList', []),
  withState('isAuth', 'setIsAuth', false),
  // END temporary UI dev props
  withHandlers({
    handleModalSubmit: ({
      dispatch,
      selectedModalPrograms,
      setActiveControlledPrograms,
    }) => () => {
      dispatch(setModal(null));
      setActiveControlledPrograms(selectedModalPrograms);
    },
    handleProgramSelect: ({
      setSelectedModalPrograms,
    }) => ({ target: { value } }) => {
      setSelectedModalPrograms([value]);
    },
  }),
  lifecycle({
    componentDidMount() {
      const { activeControlledPrograms, setSelectedModalPrograms } = this.props;
      setSelectedModalPrograms(activeControlledPrograms);
    },
  }),
);

const ControlledAccessModal = ({
  handleModalSubmit,
  handleProgramSelect,
  isFakeLoggedIn,
  selectedModalPrograms,
  setIsFakeLoggedIn,
  setSelectedModalPrograms,
  setShowDevControls,
  setUserAccessList,
  showDevControls,
  user,
  userAccessList,
}) => {
  const isAuth = user || isFakeLoggedIn;
  const userCAPrograms = data
    .filter(datum => datum.genes_mutations === 'controlled')
    .filter(datum => userAccessList.includes(datum.program))
    .map(datum => datum.program);

  const dataFormatted = formatData({
    data,
    handleProgramSelect,
    isAuth,
    selectedModalPrograms,
    setSelectedModalPrograms,
    userCAPrograms,
  });

  return (
    <BaseModal
      closeText="Close"
      extraButtons={isAuth
        ? <Button onClick={handleModalSubmit}>Explore</Button>
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
