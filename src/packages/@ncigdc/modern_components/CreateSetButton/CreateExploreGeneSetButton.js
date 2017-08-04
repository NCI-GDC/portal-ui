// @flow
import React from 'react';
import environment from '@ncigdc/modern_components/environment';
import { commitMutation, graphql } from 'react-relay';

import CreateSetButtonBase from './CreateSetButtonBase';

const exploreMutation = graphql`
  mutation CreateExploreGeneSetButtonMutation(
    $input: CreateSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      create {
        explore {
          gene(input: $input) {
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

const CreateExploreGeneSetButton = ({
  onComplete,
  children,
  ...props
}: TProps) => {
  return (
    <CreateSetButtonBase
      {...props}
      field="genes.gene_id"
      setIdExtractor={response => response.sets.create.explore.gene.set_id}
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

export default CreateExploreGeneSetButton;
