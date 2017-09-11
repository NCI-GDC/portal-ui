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
import { withCount } from '@ncigdc/modern_components/Counts';
import Spinner from '@ncigdc/theme/icons/Spinner';
import Button from '@ncigdc/uikit/Button';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  withState('selected', 'setSelected', ''),
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type, total }) => ({ sets: sets[type] || {} })),
  withRouter,
  withCount(({ field, type, scope, selected, filters }) => ({
    key: 'countInBoth',
    type,
    scope,
    filters: {
      op: 'and',
      content: [
        { op: '=', content: { field, value: `set_id:${selected}` } },
        filters,
      ].filter(Boolean),
    },
  })),
  withCount(({ field, type, scope, selected, filters }) => ({
    key: 'countExisting',
    type,
    scope,
    filters: {
      op: 'and',
      content: [{ op: '=', content: { field, value: `set_id:${selected}` } }],
    },
  })),
);

const AppendSetModal = ({
  total,
  title,
  AppendSetButton,
  selected,
  setSelected,
  filters,
  sort,
  score,
  dispatch,
  type,
  displayType,
  sets,
  field,
  query,
  history,
  location,
  setInputTotal,
  countInBoth,
  countExisting,
}) => {
  const validating = selected && (countInBoth === -1 || countExisting === -1);
  const nothingToAdd = !validating && total === countInBoth;

  return (
    <BaseModal
      title={title}
      closeText="Cancel"
      extraButtons={
        validating ? (
          <Button disabled leftIcon={<Spinner />}>
            Validating
          </Button>
        ) : (
          <AppendSetButton
            disabled={
              !selected || countExisting >= MAX_SET_SIZE || nothingToAdd
            }
            set_id={`set_id:${selected}`}
            filters={{
              op: 'and',
              content: [
                filters,
                {
                  op: 'excludeifany',
                  content: {
                    field,
                    value: [`set_id:${selected}`],
                  },
                },
              ].filter(Boolean),
            }}
            size={MAX_SET_SIZE - countExisting}
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
        )
      }
    >
      <SetTable
        style={{ marginTop: 10 }}
        setSelected={setSelected}
        selected={selected}
        type={type}
        field={field}
      />
      {selected &&
        !validating && [
          countExisting + total - countInBoth > MAX_SET_SIZE && (
            <WarningBox key="over-max">
              Above maximum of {pluralize(displayType, MAX_SET_SIZE, true)}.
              {countExisting < MAX_SET_SIZE && (
                <span>
                  &nbsp;Only the top{' '}
                  {(MAX_SET_SIZE - countExisting).toLocaleString()} will be
                  saved.
                </span>
              )}
            </WarningBox>
          ),
          nothingToAdd && (
            <WarningBox key="nothing-to-add">
              All {pluralize(displayType, 2)} already in set.
            </WarningBox>
          ),
        ]}
    </BaseModal>
  );
};

export default enhance(AppendSetModal);
