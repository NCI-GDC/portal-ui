// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';
import JSURL from 'jsurl';
import { compose } from 'recompose';

import withRouter from '@ncigdc/utils/withRouter';
import { makeFilter } from '@ncigdc/utils/filters';

import CreateSetButtonBase from './CreateSetButtonBase';

const repositoryMutation = graphql`
  mutation CreateRepositoryCaseSetButtonMutation(
    $input: CreateSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      create {
        repository {
          case(input: $input) {
            set_id
          }
        }
      }
    }
  }
`;

const enhance = compose(withRouter);

const CreateRepositoryCaseSetButton = ({ filters, setSize, style, push }) => {
  const reRouteOnCompleted = setId => {
    push({
      pathname: '/exploration',
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
      disabled={!setSize}
      style={style}
      filters={filters}
      field="cases.case_id"
      commitMutation={(variables, onCompleted, onError) => {
        commitMutation(environment, {
          mutation: repositoryMutation,
          variables,
          onCompleted,
          onError,
        });
      }}
      setIdExtractor={response => response.sets.create.repository.case.set_id}
      reRouteOnCompleted={reRouteOnCompleted}
    >
      View {setSize.toLocaleString()} {setSize === 1 ? ' Case' : ' Cases'} in
      Exploration
    </CreateSetButtonBase>
  );
};

export default enhance(CreateRepositoryCaseSetButton);
