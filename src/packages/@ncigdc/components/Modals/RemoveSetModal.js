// @flow
import React from 'react';
import { compose, withState, withProps } from 'recompose';
import { connect } from 'react-redux';
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

const RemoveSetModal = ({
  title,
  RemoveFromSetButton,
  selected,
  setSelected,
  filters,
  dispatch,
  type,
  sets,
  history,
  query,
}) =>
  <BaseModal
    title={title}
    extraButtons={
      <RemoveFromSetButton
        disabled={!selected}
        setId={`set_id:${sets[selected]}`}
        filters={filters}
        action="remove"
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
      </RemoveFromSetButton>
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
  </BaseModal>;

export default enhance(RemoveSetModal);
