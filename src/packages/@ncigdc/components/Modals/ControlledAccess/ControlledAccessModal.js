// @flow
import React, { Component } from 'react';
import {
  compose, withState,
} from 'recompose';
import { uniq } from 'lodash';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import Button from '@ncigdc/uikit/Button';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { setModal } from '@ncigdc/dux/modal';

import CAMessage from './CAMessage';
import CADevControls from './CADevControls';
import { dataStub, getHeadings, formatData } from './helpers';

const enhance = compose(
  withState('isFakeLoggedIn', 'setIsFakeLoggedIn', false),
  withState('showDevControls', 'setShowDevControls', false),
  withState('userAccessList', 'setUserAccessList', []),
  withState('selectedPrograms', 'setSelectedPrograms', []),
);

class ControlledAccessModal extends Component {
  handleModalSubmit = () => {
    const { dispatch, selectedPrograms } = this.props;
    if (selectedPrograms.length === 0) {
      dispatch(setModal(null));
    }
  }

  handleProgramSelect = ({ target: { value } }) => {
    const { selectedPrograms, setSelectedPrograms } = this.props;
    const nextPrograms = uniq([...selectedPrograms, value]);
    setSelectedPrograms(nextPrograms);
  }

  render() {
    const {
      handleModalSubmit,
      isFakeLoggedIn,
      selectedPrograms,
      setIsFakeLoggedIn,
      setSelectedPrograms,
      setShowDevControls,
      setUserAccessList,
      showDevControls,
      user,
      userAccessList,
    } = this.props;
    const isAuth = user || isFakeLoggedIn;
    const userCAPrograms = dataStub
      .filter(datum => datum.genes_mutations === 'controlled')
      .filter(datum => userAccessList.includes(datum.program))
      .map(datum => datum.program);

    const dataFormatted = formatData({
      data: dataStub,
      handleProgramSelect: this.handleProgramSelect,
      isAuth,
      selectedPrograms,
      setSelectedPrograms,
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
  }
}

export default enhance(ControlledAccessModal);
