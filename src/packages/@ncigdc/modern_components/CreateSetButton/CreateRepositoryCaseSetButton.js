// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';

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

type TProps = {
  onComplete: Function,
  children: any,
};

const CreateRepositoryCaseSetButton = ({
  onComplete,
  children,
  ...props
}: TProps) => {
  return (
    <CreateSetButtonBase
      {...props}
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
      reRouteOnCompleted={onComplete}
    >
      {children}
    </CreateSetButtonBase>
  );
};

export default CreateRepositoryCaseSetButton;
