// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState, withProps } from 'recompose';
import { stringify } from 'query-string';

import BaseModal from '@ncigdc/components/Modals/BaseModal';
import { replaceSet } from '@ncigdc/dux/sets';
import SetTable from '@ncigdc/components/SetTable';
import withRouter from '@ncigdc/utils/withRouter';

import onSaveComplete from './onSaveComplete';

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
                  content: { field, value: [`set_id:${selected}`] },
                },
              ],
            }
          }
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
        </CreateSetButton>
      }
      closeText="Cancel"
    >
      <SetTable
        setSelected={setSelected}
        selected={selected}
        type={type}
        field={field}
      />
    </BaseModal>
  );
};

export default enhance(AppendSetModal);
