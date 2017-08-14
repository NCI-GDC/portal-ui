// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const repositoryMutation = graphql`
  mutation RemoveFromRepositoryCaseSetButtonMutation(
    $input: RemoveSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      remove {
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
  children: any,
  filters: TGroupFilter,
  setId: string,
};

const RemoveFromRepositoryCaseSetButton = ({
  children,
  filters,
  setId,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters, set_id: setId }}
      field="cases.case_id"
      setIdExtractor={response => response.sets.remove.repository.case.set_id}
      mutation={repositoryMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default RemoveFromRepositoryCaseSetButton;
