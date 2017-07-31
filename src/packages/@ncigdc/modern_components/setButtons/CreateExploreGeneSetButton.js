// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

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
  children: any,
  filters: TGroupFilter,
};

const CreateExploreGeneSetButton = ({
  children,
  filters,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters }}
      field="genes.gene_id"
      setIdExtractor={response => response.sets.create.explore.gene.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default CreateExploreGeneSetButton;
