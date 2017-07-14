// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';
import JSURL from 'jsurl';
import { compose } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';

import CreateSetButtonBase from './CreateSetButtonBase';

const exploreMutation = graphql`
  mutation CreateExploreCaseSetButtonMutation(
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

const enhance = compose(withRouter);

const CreateExploreCaseSetButton = ({ filters, setSize, style, push }) => {
  const reRouteOnCompleted = setId => {
    push({
      pathname: '/repository',
      query: {
        filters: JSURL.stringify(
          makeFilter([
            {
              field: 'cases.case_id',
              value: `set_id:${setId}`,
            },
          ]),
        ),
      },
    });
  };

  return (
    <CreateSetButtonBase
      style={style}
      field="cases.case_id"
      filters={filters}
      disabled={!setSize}
      setIdExtractor={response => response.sets.create.explore.case.set_id}
      commitMutation={(variables, onCompleted, onError) => {
        commitMutation(environment, {
          mutation: exploreMutation,
          variables,
          onCompleted,
          onError,
        });
      }}
      reRouteOnCompleted={reRouteOnCompleted}
    >
      View in Repository
    </CreateSetButtonBase>
  );
};

export default enhance(CreateExploreCaseSetButton);
