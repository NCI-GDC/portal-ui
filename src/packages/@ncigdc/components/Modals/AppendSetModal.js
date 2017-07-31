// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { stringify } from 'query-string';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { addSet } from '@ncigdc/dux/sets';
import { setModal } from '@ncigdc/dux/modal';
import withRouter from '@ncigdc/utils/withRouter';

const enhance = compose(
  withState('selected', 'setSelected', ''),
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({ sets: sets[type] || {} })),
  withRouter,
);

const AppendSetModal = ({
  title,
  CreateSetButton,
  selected,
  setSelected,
  filters,
  dispatch,
  type,
  sets,
  field,
  query,
  history,
  location,
}) => {
  return (
    <BaseModal
      title={title}
      extraButtons={
        <CreateSetButton
          disabled={!selected}
          filters={
            filters && {
              op: 'OR',
              content: [
                filters,
                {
                  op: 'in',
                  content: { field, value: [`set_id:${sets[selected]}`] },
                },
              ],
            }
          }
          onComplete={setId => {
            if ((query.filters || '').includes(sets[selected])) {
              history.replace({
                search: `?${stringify({
                  ...query,
                  filters: query.filters.replace(sets[selected], setId),
                })}`,
              });
            }
            dispatch(setModal(null));
            dispatch(addSet({ type, label: selected, id: setId }));
          }}
        >
          Save
        </CreateSetButton>
      }
      closeText="Cancel"
    >
      <select
        autoFocus
        value={selected}
        onChange={e => setSelected(e.target.value)}
      >
        <option value="" disabled selected>Select set</option>
        {Object.keys(sets).map(key =>
          <option key={key} value={key}>{key}</option>,
        )}
      </select>
    </BaseModal>
  );
};

export default enhance(AppendSetModal);
