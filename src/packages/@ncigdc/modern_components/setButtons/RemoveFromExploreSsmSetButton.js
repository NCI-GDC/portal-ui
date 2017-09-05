// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation RemoveFromExploreSsmSetButtonMutation(
    $input: RemoveFromSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      remove_from {
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
  setId: string,
};

const RemoveFromExploreSsmSetButton = ({
  children,
  filters,
  setId,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters, set_id: setId }}
      field="ssms.ssm_id"
      setIdExtractor={response => response.sets.remove_from.explore.ssm.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default RemoveFromExploreSsmSetButton;
