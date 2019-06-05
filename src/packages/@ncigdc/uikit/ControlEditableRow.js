// @flow
import React from 'react';
import {
  compose,
  withState,
  withHandlers,
} from 'recompose';

import Input from '@ncigdc/uikit/Form/Input';
import Pencil from '@ncigdc/theme/icons/Pencil';
import { Row, Column } from '@ncigdc/uikit/Flex';
import OutsideClickHandler from 'react-outside-click-handler';

export default compose(
  withState('isEditing', 'setIsEditing', ({ isEditing }: any) => isEditing || false),
  withState('value', 'setValue', ({ text }: any) => text),
  withHandlers({
    handleCancel: ({
      cleanWarning,
      setIsEditing,
      setValue,
      text,
    }: any) => () => {
      setIsEditing(false);
      setValue(text);
      cleanWarning();
    },
    toggleEditingAndSave: ({
      disabled = false,
      handleSave,
      isEditing,
      setIsEditing,
      value,
    }: any) => () => {
      if (disabled) {
        return;
      }
      if (value.length !== 0) {
        if (isEditing) {
          if (handleSave(value) !== 'unsave') {
            setIsEditing(false);
          }
        } else {
          setIsEditing(true);
        }
      }
    },
  }),
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
    noEditingStyle,
    disableOnKeyDown = false,
    warning,
    onEdit,
  }): any => {
    return (
      <React.Fragment>
        {isEditing ? (
          <OutsideClickHandler
            onOutsideClick={() => {
              if (disableOnKeyDown) {
                return;
              }
              toggleEditingAndSave();
            }}
          >
            <Column>
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
                  onChange={e => {
                    onEdit(e.target.value);
                    setValue(e.target.value);
                  }}
                  onFocus={e => e.target.select()}
                  onKeyDown={e => {
                    if (!disableOnKeyDown && (e.key === 'Enter')) {
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
              </Row>
              {warning
                ? (
                  <Row style={{ color: 'red' }}>
                    {warning}
                  </Row>
                ) : null}
            </Column>
          </OutsideClickHandler>
        )
          : (
            <Row
              style={{
                cursor: disabled ? 'not-allowed' : 'default',
                ...noEditingStyle,
              }}
            >
              {children}
              <Pencil
                onClick={toggleEditingAndSave}
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
          )
        }
      </React.Fragment >
    );
  }
);
