// @flow
import React from 'react';
import { compose, withState, withProps, withPropsOnChange } from 'recompose';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet, replaceSet } from '@ncigdc/dux/sets';
import WarningBox from '@ncigdc/uikit/WarningBox';
import pluralize from '@ncigdc/utils/pluralize';
import filtersToName from '@ncigdc/utils/filtersToName';
import InputWithWarning from '@ncigdc/uikit/InputWithWarning';
import { MAX_SET_SIZE, MAX_SET_NAME_LENGTH } from '@ncigdc/utils/constants';

import onSaveComplete from './onSaveComplete';

const addOrReplace = ({ dispatch, existingSet, setName, setId, type }) => {
  if (existingSet) {
    dispatch(replaceSet({ type, oldId: existingSet[0], newId: setId }));
  } else {
    dispatch(addSet({ type, label: setName, id: setId }));
  }
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState(
    'inputName',
    'setInputName',
    ({ filters, displayType, sets, setName, selectedIds }) =>
      setName ||
      filtersToName({
        filters,
        sets,
        length: MAX_SET_NAME_LENGTH,
        displayType,
        selectedIds,
      }) ||
      `All ${displayType}s`,
  ),
  withProps(({ sets, type, total }) => ({
    sets: sets[type] || {},
    max: Math.min(MAX_SET_SIZE, total),
  })),
  withState('inputTotal', 'setInputTotal', ({ max }) => max),
  withState('shouldCallCreateSet', 'setShouldCallCreateSet', false),
  withState('submitted', 'submit', false),
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
  max,
  submitted,
  submit,
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
          forceClick={submitted}
          disabled={
            !inputTotal ||
            (!inputName ||
              inputTotal > max ||
              inputName.length > MAX_SET_NAME_LENGTH)
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

            addOrReplace({
              dispatch,
              existingSet,
              setName: inputName,
              setId,
              type,
            });
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
          max={max}
          min="1"
          value={inputTotal}
          onChange={e => setInputTotal(parseInt(e.target.value, 10))}
        />
        <div style={{ fontSize: '0.8em' }}>
          You can save up to the top {pluralize(displayType, max, true)}
        </div>
      </label>

      {inputTotal > max && (
        <WarningBox>
          Above maximum of {pluralize(displayType, max, true)}
        </WarningBox>
      )}

      <InputWithWarning
        labelText="Name:"
        showWarning={existingSet}
        handleOnKeyPress={e => {
          if (e.key === 'Enter') {
            submit(() => true);
          }
        }}
        handleOnChange={e => setInputName(e.target.value)}
        warningMessage="Warning: A set with the same name exists, this will overwrite it."
        maxLength={MAX_SET_NAME_LENGTH}
        value={inputName}
      />
    </BaseModal>
  );
};

export default enhance(SaveSetModal);

export const UploadAndSaveSetModal = compose(
  connect(({ sets }) => ({ sets })),
  withState('setName', 'setSetName', ''),
  withProps(({ sets, type }) => ({
    sets: sets[type] || {},
  })),
  withPropsOnChange(['setName', 'sets'], ({ sets, setName }) => ({
    existingSet: Object.entries(sets).find(([, label]) => label === setName),
  })),
)(
  ({
    dispatch,
    sets,
    setName,
    setSetName,
    existingSet,
    CreateSetButton,
    type,
    UploadSet,
  }) => (
    <UploadSet
      content={
        <InputWithWarning
          labelText="Name:"
          handleOnChange={e => setSetName(e.target.value)}
          showWarning={existingSet}
          warningMessage="Warning: A set with the same name exists, this will overwrite it."
          maxLength={MAX_SET_NAME_LENGTH}
          style={{ marginBottom: '1rem' }}
        />
      }
      CreateButton={withProps(() => ({
        onComplete: setId => {
          onSaveComplete({
            dispatch,
            label: setName,
          });
          addOrReplace({ dispatch, existingSet, setName, setId, type });
        },
        disabled: !setName || setName.length > MAX_SET_NAME_LENGTH,
      }))(CreateSetButton)}
    />
  ),
);
