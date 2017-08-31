// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation CreateExploreSsmSetButtonMutation(
    $input: CreateSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      create {
        explore {
          ssm(input: $input) {
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

const CreateExploreSsmSetButton = ({ children, filters, ...props }: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters }}
      field="ssms.ssm_id"
      setIdExtractor={response => response.sets.create.explore.ssm.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default CreateExploreSsmSetButton;
