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
import { updateClinicalAnalysisSet } from '@ncigdc/dux/analysis';

import onSaveComplete from './onSaveComplete';

const enhance = compose(
  withState('selected', 'setSelected', ''),
  connect(({ analysis, sets }) => ({
    sets,
    analysis,
  })),
  withProps(({
    analysis, sets, total, type,
  }) => ({
    sets: sets[type] || {},
    analyses: analysis.saved || [],
  })),
  withRouter,
  withCount(({
    field, filters, scope, selected, type,
  }) => ({
    key: 'countInBoth',
    type,
    scope,
    filters: {
      op: 'and',
      content: [
        {
          op: '=',
          content: {
            field,
            value: `set_id:${selected}`,
          },
        },
        filters,
      ].filter(Boolean),
    },
  })),
  withCount(({
    field, filters, scope, selected, type,
  }) => ({
    key: 'countExisting',
    type,
    scope,
    filters: {
      op: 'and',
      content: [
        {
          op: '=',
          content: {
            field,
            value: `set_id:${selected}`,
          },
        },
      ],
    },
  }))
);

const AppendSetModal = ({
  AppendSetButton,
  analyses,
  countExisting,
  countInBoth,
  dispatch,
  displayType,
  field,
  filters,
  history,
  location,
  query,
  score,
  selected,
  setInputTotal,
  setSelected,
  sets,
  sort,
  title,
  total,
  type,
}) => {
  const validating = selected && (countInBoth === -1 || countExisting === -1);
  const nothingToAdd = !validating && total === countInBoth;

  return (
    <BaseModal
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
            onComplete={async setId => {
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

              await dispatch(
                replaceSet({
                  type,
                  oldId: selected,
                  newId: setId,
                })
              );
              if (type === 'case') {
                await analyses
                  .filter(analysis => analysis.sets.case[selected])
                  .forEach(affected => {
                    dispatch(
                      updateClinicalAnalysisSet({
                        id: affected.id,
                        setId,
                        setName: affected.sets.case[selected],
                      })
                    );
                  });
              }
            }}
            score={score}
            set_id={`set_id:${selected}`}
            size={MAX_SET_SIZE - countExisting}
            sort={sort}
            >
            Save
          </AppendSetButton>
      )
      }
      title={title}
      >
      <SetTable
        field={field}
        getDisabledMessage={({ count }) => (count >= MAX_SET_SIZE
            ? `The set cannot exceed ${pluralize(
                displayType,
                MAX_SET_SIZE,
                true
              )}`
            : '')
        }
        selected={selected}
        setSelected={setSelected}
        style={{ marginTop: 10 }}
        type={type}
        />
      {selected &&
        !validating && [
        countExisting + total - countInBoth > MAX_SET_SIZE && (
        <WarningBox key="over-max">
              Above maximum of
          {' '}
          {pluralize(displayType, MAX_SET_SIZE, true)}
.
          {countExisting < MAX_SET_SIZE && (
          <span>
                  &nbsp;Only the top
            {' '}
            {(MAX_SET_SIZE - countExisting).toLocaleString()}
            {' '}
will be
                  saved.
          </span>
          )}
        </WarningBox>
        ),
        nothingToAdd && (
        <WarningBox key="nothing-to-add">
              All
          {' '}
          {pluralize(displayType, 2)}
          {' '}
already in set.
        </WarningBox>
        ),
      ]}
    </BaseModal>
  );
};

export default enhance(AppendSetModal);
