// @flow
import React from 'react';
import {
  compose,
  withState,
  withHandlers,
  defaultProps,
  lifecycle,
} from 'recompose';

import Input from '@ncigdc/uikit/Form/Input';
import Pencil from '@ncigdc/theme/icons/Pencil';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import { MAX_SET_NAME_LENGTH } from '@ncigdc/utils/constants';
import { Tooltip } from './Tooltip/index';

export default compose(
  withState('isEditing', 'setIsEditing', ({ isEditing }) => isEditing || false),
  withState('value', 'setValue', ({ text }) => text),
  defaultProps({
    handleSave: () => { },
  }),
  withHandlers({
    handleCancel: ({ setIsEditing, setValue, text }) => () => {
      setIsEditing(false);
      setValue(text);
    },
  }),
  withHandlers({
    toggleEditingAndSave: ({
      disabled = false,
      handleSave,
      isEditing,
      setIsEditing,
      text,
      value,
    }) => () => {
      if (disabled) {
        return;
      }
      if (value.length !== 0) {
        setIsEditing(!isEditing);
        if (isEditing && value !== text) {
          handleSave(value);
        }
      }
    },
  }),
  lifecycle({
    componentDidUpdate({
      isEditing, setValue, text, value,
    }): void {
      if (!isEditing && value !== text) {
        setValue(text);
      }
    },
  })
)(
  ({
    isEditing,
    toggleEditingAndSave,
    value,
    setValue,
    handleCancel,
    children,
    iconStyle = {},
    containerStyle = {},
    disabled = false,
    disabledMessage = null,
    pencilEditingOnly = false,
    noEditingStyle,
  }) => {
    return (
      <React.Fragment>
        {isEditing ? (
          <Row
            spacing="5px"
            style={{
              alignItems: 'center',
              justifyContent: 'space-between',
              ...containerStyle,
            }}
            >
            <Input
              autoFocus
              onChange={e => setValue(e.target.value)}
              onFocus={e => e.target.select()}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  toggleEditingAndSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              style={{
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                width: '300px',
              }}
              type="text"
              value={value}
              />
            <Tooltip
              Component={
                value.split(' ').join('').length === 0
                  ? 'Name must not be empty'
                  : value.length > MAX_SET_NAME_LENGTH
                    ? `Maximum name length ${MAX_SET_NAME_LENGTH}`
                    : null
              }
              >
              <Button
                disabled={
                  value.split(' ').join('').length === 0 ||
                  value.length > MAX_SET_NAME_LENGTH
                }
                onClick={toggleEditingAndSave}
                style={{
                  ...visualizingButton,
                }}
                >
                Save
              </Button>
            </Tooltip>
            <Button onClick={handleCancel} style={visualizingButton}>
              Cancel
            </Button>
          </Row>
        )
          : (
            <Tooltip Component={disabled ? disabledMessage : null}>
              <Row
                onClick={pencilEditingOnly ? null : toggleEditingAndSave}
                style={{
                  cursor: disabled ? 'not-allowed' : (pencilEditingOnly ? 'default' : 'text'),
                  ...noEditingStyle,
                }}
                >
                {children}
                <Pencil
                  onClick={pencilEditingOnly ? toggleEditingAndSave : null}
                  style={{
                    alignSelf: 'center',
                    color: 'rgb(96, 111, 81)',
                    fontSize: '0.9em',
                    paddingLeft: '5px',
                    ...iconStyle,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                  />
              </Row>
            </Tooltip>
          )}
      </React.Fragment>
    );
  }
);
