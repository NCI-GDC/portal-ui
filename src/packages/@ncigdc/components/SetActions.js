import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { capitalize } from 'lodash/string';

import Dropdown from '@ncigdc/uikit/Dropdown';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { Column } from '@ncigdc/uikit/Flex';
import { setModal } from '@ncigdc/dux/modal';
import SaveSetModal from '@ncigdc/components/Modals/SaveSetModal';
import AppendSetModal from '@ncigdc/components/Modals/AppendSetModal';
import RemoveSetModal from '@ncigdc/components/Modals/RemoveSetModal';
import DropdownItem from '@ncigdc/uikit/DropdownItem';
import { theme } from '@ncigdc/theme';
import pluralize from '@ncigdc/utils/pluralize';

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({
    hasSets: !!Object.keys(sets[type] || {}).length,
  })),
);

export default enhance(
  ({
    type,
    displayType,
    dispatch,
    CreateSetButton,
    AppendSetButton,
    RemoveFromSetButton,
    field,
    style,
    hasSets,
    selectedIds,
    sort,
    score,
    scope,
    ...props
  }) => {
    const titleType = displayType.replace(/^./, m => m.toUpperCase());
    const total = selectedIds.length || props.total || 0;
    const countAndType = pluralize(titleType, total, true);
    const filters = selectedIds.length
      ? {
        op: 'and',
        content: [
          {
            op: 'in',
            content: {
              field,
              value: selectedIds,
            },
          },
        ],
      }
      : props.filters;
    return (
      <Dropdown
        button={(
          <Button
            disabled={!total}
            style={{
              ...visualizingButton,
              ...style,
            }}>
            Save/Edit
            {' '}
            {titleType}
            {' '}
Set
          </Button>
        )}
        dropdownStyle={{
          top: '100%',
          marginTop: 5,
          whiteSpace: 'nowrap',
        }}>
        <Column style={{ minWidth: '22rem' }}>
          <DropdownItem
            style={{
              fontSize: '0.9em',
              color: theme.greyScale2,
              ':hover': {
                color: theme.greyScale2,
                background: 'none',
              },
            }}>
            {countAndType}
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              dispatch(
                setModal(
                  <SaveSetModal
                    CreateSetButton={CreateSetButton}
                    displayType={displayType}
                    filters={filters}
                    score={score}
                    setName={
                      (selectedIds || []).length
                        ? `Custom ${capitalize(displayType)} Selection`
                        : ''
                    }
                    sort={sort}
                    title={`Save ${countAndType} as New Set`}
                    total={total}
                    type={type} />,
                ),
              );
            }}
            style={{
              lineHeight: '1.5',
              cursor: 'pointer',
            }}>
            Save as new
            {' '}
            {displayType}
            {' '}
set
          </DropdownItem>
          {hasSets && (
            <DropdownItem
              onClick={() => {
                dispatch(
                  setModal(
                    <AppendSetModal
                      AppendSetButton={AppendSetButton}
                      displayType={displayType}
                      field={field}
                      filters={filters}
                      scope={scope}
                      score={score}
                      sort={sort}
                      title={`Add ${countAndType} to Existing Set`}
                      total={total}
                      type={type} />,
                  ),
                );
              }}
              style={{
                lineHeight: '1.5',
                cursor: 'pointer',
              }}>
              Add to existing
              {' '}
              {displayType}
              {' '}
set
            </DropdownItem>
          )}
          {hasSets && (
            <DropdownItem
              onClick={() => {
                dispatch(
                  setModal(
                    <RemoveSetModal
                      field={field}
                      filters={filters}
                      RemoveFromSetButton={RemoveFromSetButton}
                      title={`Remove ${countAndType} from Existing Set`}
                      type={type} />,
                  ),
                );
              }}
              style={{
                lineHeight: '1.5',
                cursor: 'pointer',
              }}>
              Remove from existing
              {' '}
              {displayType}
              {' '}
set
            </DropdownItem>
          )}
        </Column>
      </Dropdown>
    );
  },
);
