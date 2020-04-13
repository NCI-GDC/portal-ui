import React from 'react';
import { connect } from 'react-redux';
import {
  compose,
  setDisplayName,
  withHandlers,
  withState,
} from 'recompose';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import LoginButton from '@ncigdc/components/LoginButton';
import ExploreLink, { defaultExploreQuery } from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import RestrictionMessage from '@ncigdc/modern_components/RestrictionMessage/RestrictionMessage';

import CAMessage from './CAMessage';
import { getHeadings, formatData } from './helpers';

import './styles.scss';

const ControlledAccessModal = ({
  handleModalSubmit,
  handleProgramSelect,
  selectedStudies,
  setSelectedStudies,
  studiesList,
  user,
  userAccessList,
}) => (
  <BaseModal
    closeText="Cancel"
    extraButtons={user
      ? (
        <ExploreLink
          className="action-button"
          disabled={user &&
            selectedStudies.length < 1}
          onClick={handleModalSubmit}
          query={{
            controlled: selectedStudies.join(',').toUpperCase(),
            ...defaultExploreQuery,
          }}
          testTag="explore-selected-studies"
          >
          Explore
        </ExploreLink>
      )
      : (
        <LoginButton
          className="action-button"
          keepModalOpen
          testTag="controlled_access-login-button"
          >
          Login
        </LoginButton>
    )}
    title="Explore Controlled & Open Data"
    >
    <CAMessage user={user} userAccessList={userAccessList} />

    <EntityPageHorizontalTable
      data={formatData({
        handleProgramSelect,
        selectedStudies,
        setSelectedStudies,
        studiesList,
        user,
        userAccessList,
      })}
      headings={getHeadings({
        user,
      })}
      tableContainerStyle={{ maxHeight: 350 }}
      tableId="controlled-access-table"
      />

    {!!user || (
      <RestrictionMessage
        compact
        faClass="fa-lock"
        faStyle={{ color: '#773388' }}
        fullWidth
        leftAlign
        title="The controlled data require dbGaP access"
        >
        <span>
          {'If you don\'t have access, follow the instructions for '}
          <a href="https://gdc.cancer.gov/access-data/obtaining-access-controlled-data" rel="noopener noreferrer" target="_blank">obtaining access to controlled data</a>
          .
        </span>
      </RestrictionMessage>
    )}
  </BaseModal>
);

export default compose(
  setDisplayName('EnhancedControlledAccessModal'),
  connect(state => ({
    user: state.auth.user,
  })),
  withState(
    'selectedStudies',
    'setSelectedStudies',
    ({
      activeControlledPrograms,
      userAccessList,
    }) => (userAccessList.length === 1 ? userAccessList : activeControlledPrograms),
    // TODO: this ^^^ is a placeholder for the "controlled" array of the CA response.
  ),
  withHandlers({
    handleModalSubmit: ({
      closeModal,
    }) => () => {
      closeModal();
    },
    handleProgramSelect: ({
      setSelectedStudies,
    }) => ({ target: { value } }) => {
      setSelectedStudies([value]);
    },
  }),
)(ControlledAccessModal);
