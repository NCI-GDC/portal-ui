// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { get } from 'lodash';
import { commitMutation } from 'react-relay';

import environment from '@ncigdc/modern_components/environment';
import Button from '@ncigdc/uikit/Button';
import { setModal } from '@ncigdc/dux/modal';
import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

const enhance = compose(
  withState('isCreating', 'setIsCreating', false),
  connect(),
);

const SetButtonBase = ({
  setIdExtractor,
  onComplete,
  style,
  isCreating,
  setIsCreating,
  dispatch,
  children,
  disabled,
  field,
  input,
  mutation,
}) => {
  return (
    <span>
      <Overlay show={isCreating}>
        <Spinner />
      </Overlay>
      <Button
        disabled={disabled}
        style={style}
        onClick={() => {
          const { filters } = input;
          const content = get(filters, 'content[0].content');
          const setOnlyInCurrentFilters = filters
            ? filters.content.length === 1 &&
                content.value.length === 1 &&
                content.value[0].toString().includes('set_id:') &&
                content.field === field
            : false;

          if (
            (setOnlyInCurrentFilters && !input.set_id) ||
            input.set_id === get(content, 'value[0]', '')
          ) {
            const setId = get(content, 'value[0]', '').substring(
              'set_id:'.length,
            );
            onComplete(setId);
          } else {
            setIsCreating(true);
            commitMutation(environment, {
              mutation,
              variables: { input: { ...input, filters: filters || {} } },
              onCompleted: response => {
                setIsCreating(false);
                onComplete(setIdExtractor(response));
              },
              onError: err => {
                setIsCreating(false);
                dispatch(
                  setModal(
                    <div style={{ padding: '15px' }}>
                      <h3>Error creating set</h3>{`${err}`}
                    </div>,
                  ),
                );
              },
            });
          }
        }}
      >
        {children}
      </Button>
    </span>
  );
};

export default enhance(SetButtonBase);
