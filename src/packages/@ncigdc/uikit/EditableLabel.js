// @flow
import React from 'react';
import { compose, withState, withHandlers, defaultProps } from 'recompose';

import Input from '@ncigdc/uikit/Form/Input';
import Pencil from '@ncigdc/theme/icons/Pencil';
import { Row } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';

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
    }) => () => {
      if (value.length !== 0) {
        setIsEditing(!isEditing);
        if (isEditing && value !== text) {
          handleSave(value);
        }
      }
    },
  }),
)(
  ({
    text,
    isEditing,
    toggleEditingAndSave,
    value,
    setValue,
    setIsEditing,
    handleCancel,
  }) =>
    <div>
      {isEditing
        ? <Row style={{ justifyContent: 'space-between' }}>
            <Input
              style={{ width: '80%' }}
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
            />
            <Button
              onClick={toggleEditingAndSave}
              disabled={value.length === 0}
            >
              Save
            </Button>
            <Button onClick={handleCancel}>
              Cancel
            </Button>
          </Row>
        : <Row onClick={toggleEditingAndSave} style={{ cursor: 'text' }}>
            {value}
            <Pencil style={{ paddingLeft: '5px' }} />
          </Row>}
    </div>,
);
