// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet, replaceSet } from '@ncigdc/dux/sets';
import filtersToName from '@ncigdc/utils/filtersToName';
import WarningBox from '@ncigdc/uikit/WarningBox';
import pluralize from '@ncigdc/utils/pluralize';
import { MAX_SET_SIZE, MAX_SET_NAME_LENGTH } from '@ncigdc/utils/constants';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState(
    'inputName',
    'setInputName',
    ({ filters, displayType, sets, setName }) =>
      setName ||
      filtersToName({ filters, sets, length: MAX_SET_NAME_LENGTH }) ||
      `All ${displayType}s`,
  ),
  withState('inputTotal', 'setInputTotal', ({ total }) =>
    Math.min(MAX_SET_SIZE, total),
  ),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
  withState('shouldCallCreateSet', 'setShouldCallCreateSet', false),
);

const SaveSetModal = ({
  title,
  CreateSetButton,
  inputName,
  setInputName,
  filters,
  sort,
  score,
  dispatch,
  type,
  displayType,
  sets,
  shouldCallCreateSet,
  setShouldCallCreateSet,
  inputTotal,
  setInputTotal,
}) => {
  const existingSet = Object.entries(sets).find(
    ([, label]) => label === inputName,
  );
  return (
    <BaseModal
      title={title}
      onKeyDown={event => event.key === 'Enter' && setShouldCallCreateSet(true)}
      extraButtons={
        <CreateSetButton
          forceCreate
          disabled={
            !inputName ||
            inputTotal > MAX_SET_SIZE ||
            inputName.length > MAX_SET_NAME_LENGTH
          }
          filters={filters}
          size={inputTotal}
          sort={sort}
          score={score}
          shouldCallCreateSet={shouldCallCreateSet}
          onComplete={setId => {
            onSaveComplete({
              dispatch,
              label: inputName,
            });

            if (existingSet) {
              dispatch(
                replaceSet({ type, oldId: existingSet[0], newId: setId }),
              );
            } else {
              dispatch(addSet({ type, label: inputName, id: setId }));
            }
          }}
        >
          Save
        </CreateSetButton>
      }
      closeText="Cancel"
    >
      <label>
        Save top:<br />
        <input
          type="number"
          max={MAX_SET_SIZE}
          value={inputTotal}
          onChange={e => setInputTotal(e.target.value)}
        />
        <div style={{ fontSize: '0.8em' }}>
          You can save up to the top{' '}
          {pluralize(displayType, MAX_SET_SIZE, true)}
        </div>
      </label>

      {inputTotal > MAX_SET_SIZE &&
        <WarningBox>
          Above maximum of {pluralize(displayType, MAX_SET_SIZE, true)}
        </WarningBox>}

      <label style={{ marginTop: 10 }}>
        Name:<br />
        <input
          style={{ width: '100%' }}
          autoFocus
          value={inputName}
          onChange={e => setInputName(e.target.value)}
          id="save-set-modal-name"
          type="text"
        />
        {inputName.length > MAX_SET_NAME_LENGTH &&
          <WarningBox>Maximum name length is {MAX_SET_NAME_LENGTH}</WarningBox>}
      </label>
      {existingSet &&
        <WarningBox>
          Warning: A set with the same name exists,
          this will overwrite it.
        </WarningBox>}
    </BaseModal>
  );
};

export default enhance(SaveSetModal);
