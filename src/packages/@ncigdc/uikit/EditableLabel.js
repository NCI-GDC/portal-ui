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
  withState('isEditing', 'setIsEditing', false),
  withState('value', 'setValue', ({ text }) => text),
  defaultProps({
    handleSave: value => console.log(value),
  }),
  withHandlers({
    handleCancel: ({ text, setIsEditing, setValue }) => () => {
      setIsEditing(false);
      setValue(text);
    },
  }),
  withHandlers({
    toggleEditingAndSave: ({
      isEditing,
      setIsEditing,
      value,
      text,
      handleSave,
      handleCancel,
      disabled = false,
    }) => () => {
      if (disabled) {
        return null;
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
    componentDidUpdate({ text, value, setValue, isEditing }): void {
      if (!isEditing && value !== text) {
        setValue(text);
      }
    },
  })
)(
  ({
    text,
    isEditing,
    toggleEditingAndSave,
    value,
    setValue,
    setIsEditing,
    handleCancel,
    children,
    iconStyle = {},
    containerStyle = {},
    disabled = false,
    disabledMessage = null,
  }) => (
      <div>
        {isEditing ? (
          <Row
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              ...containerStyle,
            }}
            spacing={'5px'}
          >
            <Input
              style={{
                width: '300px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
              }}
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  toggleEditingAndSave();
                } else if (e.key === 'Escape') {
                  handleCancel();
                }
              }}
              type="text"
              autoFocus
              onFocus={e => e.target.select()}
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
                onClick={toggleEditingAndSave}
                disabled={
                  value.split(' ').join('').length === 0 ||
                  value.length > MAX_SET_NAME_LENGTH
                }
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
        ) : (
            <Tooltip Component={disabled ? disabledMessage : null}>
              <Row
                onClick={toggleEditingAndSave}
                style={{ cursor: disabled ? 'not-allowed' : 'text' }}
              >
                {children}
                <Pencil
                  style={{
                    fontSize: '0.9em',
                    paddingLeft: '5px',
                    alignSelf: 'center',
                    color: 'rgb(96, 111, 81)',
                    ...iconStyle,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                />
              </Row>
            </Tooltip>
          )}
      </div>
    )
);