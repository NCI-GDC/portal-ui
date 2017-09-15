// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

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
  children: any,
  filters: TGroupFilter,
};

const CreateExploreCaseSetButton = ({
  children,
  filters,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters }}
      field="cases.case_id"
      setIdExtractor={response => response.sets.create.explore.case.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default CreateExploreCaseSetButton;
