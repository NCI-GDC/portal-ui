// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation AppendExploreCaseSetButtonMutation(
    $input: AppendSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      append {
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
  set_id: string,
};

const AppendExploreCaseSetButton = ({
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
      setIdExtractor={response => response.sets.append.explore.case.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default AppendExploreCaseSetButton;
