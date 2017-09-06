// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { stringify } from 'query-string';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { replaceSet } from '@ncigdc/dux/sets';
import SetTable from '@ncigdc/components/SetTable';
import withRouter from '@ncigdc/utils/withRouter';
import { MAX_SET_SIZE } from '@ncigdc/utils/constants';
import WarningBox from '@ncigdc/uikit/WarningBox';
import pluralize from '@ncigdc/utils/pluralize';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  withState('selected', 'setSelected', ''),
  withState('inputTotal', 'setInputTotal', ({ total }) =>
    Math.min(MAX_SET_SIZE, total),
  ),
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
  withRouter,
);

const AppendSetModal = ({
  title,
  AppendSetButton,
  selected,
  setSelected,
  filters,
  sort,
  score,
  dispatch,
  type,
  sets,
  field,
  query,
  history,
  location,
  inputTotal,
  setInputTotal,
}) => {
  return (
    <BaseModal
      title={title}
      extraButtons={
        <AppendSetButton
          disabled={!selected}
          set_id={`set_id:${selected}`}
          filters={filters}
          size={inputTotal}
          sort={sort}
          score={score}
          onComplete={setId => {
            if ((query.filters || '').includes(selected)) {
              history.replace({
                search: `?${stringify({
                  ...query,
                  filters: query.filters.replace(selected, setId),
                })}`,
              });
            }

            onSaveComplete({
              dispatch,
              label: sets[selected],
            });

            dispatch(replaceSet({ type, oldId: selected, newId: setId }));
          }}
        >
          Save
        </AppendSetButton>
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
          You can append up to the top {pluralize(type, MAX_SET_SIZE, true)}
        </div>
      </label>
      {inputTotal > MAX_SET_SIZE &&
        <WarningBox>
          Above maximum of {pluralize(type, MAX_SET_SIZE, true)}
        </WarningBox>}

      <SetTable
        style={{ marginTop: 10 }}
        setSelected={setSelected}
        selected={selected}
        type={type}
        field={field}
      />
    </BaseModal>
  );
};

export default enhance(AppendSetModal);
