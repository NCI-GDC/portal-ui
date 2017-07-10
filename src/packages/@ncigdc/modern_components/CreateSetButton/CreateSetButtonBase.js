// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { get } from 'lodash';

import Button from '@ncigdc/uikit/Button';
import { setModal } from '@ncigdc/dux/modal';

import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

const enhance = compose(
  withState('isCreating', 'setIsCreating', false),
  connect(),
);

const CreateSetButton = ({
  filters,
  setIdExtractor,
  commitMutation,
  reRouteOnCompleted,
  style,
  isCreating,
  setIsCreating,
  dispatch,
  children,
  disabled,
  field,
}) => {
  const onError = err => {
    setIsCreating(false);
    dispatch(
      setModal(
        <div style={{ padding: '15px' }}>
          <h3>Error creating set</h3>{`${err}`}
        </div>,
      ),
    );
  };

  const onCompleted = response => {
    setIsCreating(false);
    reRouteOnCompleted(setIdExtractor(response));
  };

  const content = get(filters, 'content[0].content');
  const setOnlyInCurrentFilters = filters
    ? filters.content.length === 1 &&
        content.value.length === 1 &&
        content.value[0].includes('set_id:') &&
        content.field === field
    : false;

  const variables = { input: { filters: filters ? filters : {} } };
  return (
    <span>
      <Overlay show={isCreating}>
        <Spinner />
      </Overlay>
      <Button
        disabled={disabled}
        style={style}
        disabled={disabled}
        onClick={() => {
          if (!setOnlyInCurrentFilters) {
            setIsCreating(true);
            commitMutation(variables, onCompleted, onError);
          } else {
            const setId = get(content, 'value[0]', '').substring(
              'set_id:'.length,
            );
            reRouteOnCompleted(setId);
          }
        }}
      >
        {children}
      </Button>
    </span>
  );
};

export default enhance(CreateSetButton);
