// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation AppendExploreGeneSetButtonMutation(
    $input: AppendSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      append {
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
  set_id: string,
};

const AppendExploreGeneSetButton = ({
  children,
  filters,
  set_id,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters, set_id }}
      field="genes.gene_id"
      setIdExtractor={response => response.sets.append.explore.gene.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default AppendExploreGeneSetButton;
