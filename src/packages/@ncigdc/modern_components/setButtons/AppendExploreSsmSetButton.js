// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation AppendExploreSsmSetButtonMutation(
    $input: AppendSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      append {
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
  set_id: string,
};

const AppendExploreSsmSetButton = ({
  children,
  filters,
  set_id,
  ...props
}: TProps) => {
  return (
    <SetButtonBase
      {...props}
      input={{ filters, set_id }}
      field="ssms.ssm_id"
      setIdExtractor={response => response.sets.append.explore.ssm.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default AppendExploreSsmSetButton;
