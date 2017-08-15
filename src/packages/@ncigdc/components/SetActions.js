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

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({
    hasSets: !!Object.keys(sets[type] || {}).length,
  })),
);

export default enhance(
  ({
    type,
    dispatch,
    CreateSetButton,
    RemoveFromSetButton,
    field,
    style,
    hasSets,
    selectedIds,
    ...props
  }) => {
    const titleType = type.replace(/^./, m => m.toUpperCase());
    const total = selectedIds.length || props.total || 0;
    const displayType = `${type}${total > 1 ? 's' : ''}`;
    const filters = selectedIds.length
      ? { op: 'in', content: { field, value: selectedIds } }
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
            {total.toLocaleString()}&nbsp;{displayType}
          </DropdownItem>
          <DropdownItem
            style={{ lineHeight: '1.5', cursor: 'pointer' }}
            onClick={() => {
              dispatch(
                setModal(
                  <SaveSetModal
                    title={
                      selectedIds.length
                        ? `Save ${total.toLocaleString()} ${displayType} as new set`
                        : `Save ${titleType} Set`
                    }
                    filters={filters}
                    type={type}
                    CreateSetButton={CreateSetButton}
                  />,
                ),
              );
            }}
          >
            Save as new {type} set
          </DropdownItem>
          {hasSets &&
            <DropdownItem
              style={{ lineHeight: '1.5', cursor: 'pointer' }}
              onClick={() => {
                dispatch(
                  setModal(
                    <AppendSetModal
                      field={field}
                      title={`Add ${total.toLocaleString()} ${displayType} to existing set`}
                      filters={filters}
                      type={type}
                      CreateSetButton={CreateSetButton}
                    />,
                  ),
                );
              }}
            >
              Add to existing {type} set
            </DropdownItem>}
          {hasSets &&
            <DropdownItem
              style={{ lineHeight: '1.5', cursor: 'pointer' }}
              onClick={() => {
                dispatch(
                  setModal(
                    <RemoveSetModal
                      field={field}
                      title={`Remove ${total.toLocaleString()} ${displayType} from existing set`}
                      filters={filters}
                      type={type}
                      RemoveFromSetButton={RemoveFromSetButton}
                    />,
                  ),
                );
              }}
            >
              Remove from existing {type} set
            </DropdownItem>}
        </Column>
      </Dropdown>
    );
  },
);
