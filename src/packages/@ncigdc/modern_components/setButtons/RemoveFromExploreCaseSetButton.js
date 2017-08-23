// @flow
import React from 'react';
import { graphql } from 'react-relay';

import SetButtonBase from './SetButtonBase';

import type { TGroupFilter } from '@ncigdc/utils/filters/types';

const exploreMutation = graphql`
  mutation RemoveFromExploreCaseSetButtonMutation(
    $input: RemoveFromSetInput
    $never_used: RelayIsDumb
  ) {
    sets(input: $never_used) {
      remove_from {
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
  setId: string,
};

const RemoveFromExploreCaseSetButton = ({
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
      setIdExtractor={response => response.sets.remove_from.explore.case.set_id}
      mutation={exploreMutation}
    >
      {children}
    </SetButtonBase>
  );
};

export default RemoveFromExploreCaseSetButton;
