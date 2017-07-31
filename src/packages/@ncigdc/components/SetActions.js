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
import DropdownItem from '@ncigdc/uikit/DropdownItem';

const enhance = compose(
  connect(({ sets }) => ({ sets })),
  withProps(({ sets, type }) => ({
    hasSets: !!Object.keys(sets[type] || {}).length,
  })),
);

export default enhance(
  ({
    disabled,
    type,
    dispatch,
    filters,
    CreateSetButton,
    field,
    style,
    hasSets,
  }) => {
    return (
      <Dropdown
        button={
          <Button
            style={{ ...visualizingButton, ...style }}
            disabled={disabled}
          >
            save/edit {type} set
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
            style={{ lineHeight: '1.5', cursor: 'pointer' }}
            onClick={() => {
              dispatch(
                setModal(
                  <SaveSetModal
                    title={`Save ${type.replace(/^./, m =>
                      m.toUpperCase(),
                    )} Set`}
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
                      title={`Add ${type}s to existing set`}
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
        </Column>
      </Dropdown>
    );
  },
);
