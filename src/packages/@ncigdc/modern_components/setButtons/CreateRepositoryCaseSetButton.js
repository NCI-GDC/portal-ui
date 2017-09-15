// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

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
  children: any,
  filters: TGroupFilter,
};

const CreateRepositoryCaseSetButton = ({
  children,
  filters,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters }}
      field="cases.case_id"
      setIdExtractor={response => response.sets.create.repository.case.set_id}
      mutation={repositoryMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default CreateRepositoryCaseSetButton;
