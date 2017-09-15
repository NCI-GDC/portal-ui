// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const repositoryMutation = graphql`
  mutation AppendRepositoryCaseSetButtonMutation(
    $input: AppendSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      append {
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
  set_id: string,
};

const AppendRepositoryCaseSetButton = ({
  children,
  filters,
  set_id,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters, set_id }}
      field="cases.case_id"
      setIdExtractor={response => response.sets.append.repository.case.set_id}
      mutation={repositoryMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default AppendRepositoryCaseSetButton;
