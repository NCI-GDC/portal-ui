// @flow
import React from 'react';
import {
  compose, withState, withProps, withPropsOnChange,
} from 'recompose';
import { connect } from 'react-redux';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet, replaceSet } from '@ncigdc/dux/sets';
import WarningBox from '@ncigdc/uikit/WarningBox';
import pluralize from '@ncigdc/utils/pluralize';
import filtersToName from '@ncigdc/utils/filtersToName';
import InputWithWarning from '@ncigdc/uikit/InputWithWarning';
import { MAX_SET_SIZE, MAX_SET_NAME_LENGTH } from '@ncigdc/utils/constants';

import onSaveComplete from './onSaveComplete';

const addOrReplace = ({
  dispatch, existingSet, setName, setId, type,
}) => {
  if (existingSet) {
    dispatch(replaceSet({
      type,
      oldId: existingSet[0],
      newId: setId,
    }));
  } else {
    dispatch(addSet({
      type,
      label: setName,
      id: setId,
    }));
  }
};

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withState(
    'inputName',
    'setInputName',
    ({
      filters, displayType, sets, setName,
    }) => setName ||
      filtersToName({
        filters,
        sets,
        length: MAX_SET_NAME_LENGTH,
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

  const isdisabled =
    (!inputTotal && inputTotal !== 0) ||
    (!inputName || inputTotal > max || inputName.length > MAX_SET_NAME_LENGTH);
  return (
    <BaseModal
      closeText="Cancel"
      extraButtons={(
        <CreateSetButton
          disabled={isdisabled}
          filters={filters}
          forceClick={submitted}
          forceCreate
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
          score={score}
          shouldCallCreateSet={shouldCallCreateSet}
          size={inputTotal}
          sort={sort}>
          Save
        </CreateSetButton>
      )}
      onKeyDown={event => event.key === 'Enter' && setShouldCallCreateSet(true)}
      title={title}>
      <label>
        Save top:
        <br />
        <input
          max={max}
          min="1"
          onChange={e => setInputTotal(parseInt(e.target.value, 10))}
          type="number"
          value={inputTotal} />
        <div style={{ fontSize: '0.8em' }}>
          You can save up to the top
          {' '}
          {pluralize(displayType, max, true)}
        </div>
      </label>

      {inputTotal > max && (
        <WarningBox>
          Above maximum of
          {' '}
          {pluralize(displayType, max, true)}
        </WarningBox>
      )}
      {!inputTotal &&
        inputTotal !== 0 && (
        <WarningBox>
            Save at least
          {' '}
          {pluralize(displayType, 0, true)}
.
        </WarningBox>
      )}
      <InputWithWarning
        handleOnChange={e => setInputName(e.target.value)}
        handleOnKeyPress={e => {
          if (e.key === 'Enter' && !isdisabled) {
            submit(() => true);
          }
        }}
        labelText="Name:"
        maxLength={MAX_SET_NAME_LENGTH}
        showWarning={existingSet}
        value={inputName}
        warningMessage="Warning: A set with the same name exists, this will overwrite it." />
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
      content={(
        <InputWithWarning
          handleOnChange={e => setSetName(e.target.value)}
          labelText="Name:"
          maxLength={MAX_SET_NAME_LENGTH}
          showWarning={existingSet}
          style={{ marginBottom: '1rem' }}
          warningMessage="Warning: A set with the same name exists, this will overwrite it." />
      )}
      CreateButton={withProps(() => ({
        onComplete: setId => {
          onSaveComplete({
            dispatch,
            label: setName,
          });
          addOrReplace({
            dispatch,
            existingSet,
            setName,
            setId,
            type,
          });
        },
        disabled:
          !setName.split(' ').join('') || setName.length > MAX_SET_NAME_LENGTH,
      }))(CreateSetButton)} />
  ),
);
