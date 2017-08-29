// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet, replaceSet } from '@ncigdc/dux/sets';
import filtersToName from '@ncigdc/utils/filtersToName';
import WarningBox from '@ncigdc/uikit/WarningBox';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState(
    'input',
    'setInput',
    ({ filters, type, sets }) =>
      filtersToName({ filters, sets }) || `All ${type}s`,
  ),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
  withState('shouldCallCreateSet', 'setShouldCallCreateSet', false),
);

const SaveSetModal = ({
  title,
  CreateSetButton,
  input,
  setInput,
  filters,
  dispatch,
  type,
  sets,
  shouldCallCreateSet,
  setShouldCallCreateSet,
}) => {
  const existingSet = Object.entries(sets).find(([, label]) => label === input);
  return (
    <BaseModal
      title={title}
      onKeyDown={event => event.key === 'Enter' && setShouldCallCreateSet(true)}
      extraButtons={
        <CreateSetButton
          forceCreate
          disabled={!input}
          filters={filters}
          shouldCallCreateSet={shouldCallCreateSet}
          onComplete={setId => {
            onSaveComplete({
              dispatch,
              label: input,
            });

            if (existingSet) {
              dispatch(
                replaceSet({ type, oldId: existingSet[0], newId: setId }),
              );
            } else {
              dispatch(addSet({ type, label: input, id: setId }));
            }
          }}
        >
          Save
        </CreateSetButton>
      }
      closeText="Cancel"
    >
      <label htmlFor="save-set-modal-name">Name: </label>
      <input
        autoFocus
        value={input}
        onChange={e => setInput(e.target.value)}
        id="save-set-modal-name"
        type="text"
      />
      {existingSet &&
        <WarningBox>
          Warning: A set with the same name exists,
          this will overwrite it.

        </WarningBox>}
    </BaseModal>
  );
};

export default enhance(SaveSetModal);
