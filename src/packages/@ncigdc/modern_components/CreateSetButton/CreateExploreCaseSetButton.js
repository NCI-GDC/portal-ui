// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';

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

type TProps = {
  onComplete: Function,
  children: any,
};

const CreateExploreCaseSetButton = ({
  onComplete,
  children,
  ...props
}: TProps) => {
  return (
    <CreateSetButtonBase
      {...props}
      field="cases.case_id"
      setIdExtractor={response => response.sets.create.explore.case.set_id}
      commitMutation={(variables, onCompleted, onError) => {
        commitMutation(environment, {
          mutation: exploreMutation,
          variables,
          onCompleted,
          onError,
        });
      }}
      reRouteOnCompleted={onComplete}
    >
      {children}
    </CreateSetButtonBase>
  );
};

export default CreateExploreCaseSetButton;
