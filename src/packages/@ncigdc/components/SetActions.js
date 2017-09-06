import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';

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
    ...props
  }) => {
    const titleType = displayType.replace(/^./, m => m.toUpperCase());
    const total = selectedIds.length || props.total || 0;
    const countAndType = pluralize(titleType, total, true);
    const filters = selectedIds.length
      ? {
          op: 'and',
          content: [{ op: 'in', content: { field, value: selectedIds } }],
        }
      : props.filters;

    return (
      <Dropdown
        button={
          <Button style={{ ...visualizingButton, ...style }} disabled={!total}>
            Save/Edit {titleType} Set
          </Button>
        }
        dropdownStyle={{
          top: '100%',
          marginTop: 5,
          whiteSpace: 'nowrap',
        }}
      >
        <Column style={{ minWidth: '22rem' }}>
          <DropdownItem
            style={{
              fontSize: '0.9em',
              color: theme.greyScale3,
              ':hover': {
                color: theme.greyScale3,
                background: 'none',
              },
            }}
          >
            {countAndType}
          </DropdownItem>
          <DropdownItem
            style={{ lineHeight: '1.5', cursor: 'pointer' }}
            onClick={() => {
              dispatch(
                setModal(
                  <SaveSetModal
                    title={`Save ${countAndType} as New Set`}
                    total={total}
                    filters={filters}
                    score={score}
                    sort={sort}
                    type={type}
                    displayType={displayType}
                    CreateSetButton={CreateSetButton}
                  />,
                ),
              );
            }}
          >
            Save as new {displayType} set
          </DropdownItem>
          {hasSets &&
            <DropdownItem
              style={{ lineHeight: '1.5', cursor: 'pointer' }}
              onClick={() => {
                dispatch(
                  setModal(
                    <AppendSetModal
                      field={field}
                      title={`Add ${countAndType} to Existing Set`}
                      total={total}
                      filters={filters}
                      score={score}
                      sort={sort}
                      type={type}
                      AppendSetButton={AppendSetButton}
                    />,
                  ),
                );
              }}
            >
              Add to existing {displayType} set
            </DropdownItem>}
          {hasSets &&
            <DropdownItem
              style={{ lineHeight: '1.5', cursor: 'pointer' }}
              onClick={() => {
                dispatch(
                  setModal(
                    <RemoveSetModal
                      field={field}
                      title={`Remove ${countAndType} from Existing Set`}
                      filters={filters}
                      type={type}
                      RemoveFromSetButton={RemoveFromSetButton}
                    />,
                  ),
                );
              }}
            >
              Remove from existing {displayType} set
            </DropdownItem>}
        </Column>
      </Dropdown>
    );
  },
);
