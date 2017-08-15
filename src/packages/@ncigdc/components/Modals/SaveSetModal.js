// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet } from '@ncigdc/dux/sets';
import { setModal } from '@ncigdc/dux/modal';
import { ExclamationTriangleIcon } from '@ncigdc/theme/icons';
import filtersToName from '@ncigdc/utils/filtersToName';
import { updateSet } from '../../dux/sets';

const enhance = compose(
  withState(
    'input',
    'setInput',
    ({ filters, type }) => filtersToName(filters) || `All ${type}s`,
  ),
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
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
}) => {
  const existingSet = Object.entries(sets).find(([, label]) => label === input);
  return (
    <BaseModal
      title={title}
      extraButtons={
        <CreateSetButton
          disabled={!input}
          filters={filters}
          onComplete={setId => {
            dispatch(setModal(null));
            if (existingSet) {
              dispatch(
                updateSet({ type, oldId: existingSet[0], newId: setId }),
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
        <div
          style={{
            marginTop: 10,
            paddingRight: '5px',
            backgroundColor: '#fcf8e3',
            borderColor: '#faebcc',
            color: '#8a6d3b',
            padding: '15px',
            border: '1px solid transparent',
            borderRadius: '4px',
          }}
        >
          <ExclamationTriangleIcon /> Warning: A set with the same name exists,
          this will overwrite it.
        </div>}
    </BaseModal>
  );
};

export default enhance(SaveSetModal);
