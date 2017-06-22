// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';
import JSURL from 'jsurl';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import Button from '@ncigdc/uikit/Button';
import { makeFilter } from '@ncigdc/utils/filters';
import { setModal } from '@ncigdc/dux/modal';

import Overlay from '@ncigdc/uikit/Overlay';
import Spinner from '@ncigdc/uikit/Loaders/Material';

const mutation = graphql`
  mutation SaveSetButtonMutation(
    $input: CreateSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      create {
        explore {
          case(input: $input) {
            set_id
          }
        }
      }
    }
  }
`;

const commitSaveSet = ({ filters, onCompleted, onError }) => {
  const variables = { input: { filters: filters ? filters : {} } };
  commitMutation(environment, {
    mutation,
    variables,
    onCompleted,
    onError,
  });
};

const enhance = compose(
  withState('isCreating', 'setIsCreating', false),
  withRouter,
  connect(),
);

const SaveSetButton = ({
  push,
  filters,
  setSize,
  isCreating,
  setIsCreating,
  dispatch,
}) => {
  const onCompleted = response => {
    setIsCreating(false);
    console.log(response);
    const { sets: { create: { explore: { case: { set_id } } } } } = response;
    push({
      pathname: '/repository',
      query: {
        filters: JSURL.stringify(
          makeFilter([
            {
              field: 'cases',
              value: `set_id:${set_id}`,
            },
          ]),
        ),
      },
    });
  };

  const onError = err => {
    console.error(err);
    setIsCreating(false);
    dispatch(
      setModal(
        <div style={{ padding: '15px' }}>
          <h3>Error creating set</h3>{`${err}`}
        </div>,
      ),
    );
  };

  return (
    <span>
      <Overlay show={isCreating}>
        <Spinner />
        <span style={{ padding: '1rem' }}>
          Creating Case set and linking you...
        </span>
      </Overlay>
      <Button
        onClick={() => {
          setIsCreating(true);
          commitSaveSet({
            filters,
            onCompleted,
            onError,
          });
        }}
      >
        See {setSize} cases in Repository
      </Button>
    </span>
  );
};

export default enhance(SaveSetButton);
