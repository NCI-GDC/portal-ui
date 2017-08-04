import React from 'react';
import JSURL from 'jsurl';
import { compose } from 'recompose';

import { replaceFilters } from '@ncigdc/utils/filters';
import { parseFilterParam } from '@ncigdc/utils/uri';
import withRouter from '@ncigdc/utils/withRouter';

type TProps = {
  hits: Array<string>,
  onClose: Function,
  push: Function,
  query: TRawQuery,
};

const enhance = compose(withRouter);

export default enhance(
  ({
    hits,
    onClose,
    push,
    query,
    idFields,
    mainField,
    type,
    CreateButton,
    ...props
  }: TProps) => {
    return (
      <CreateButton
        {...props}
        disabled={!hits.length}
        onComplete={setId => {
          onClose();
          push({
            pathname: '/exploration',
            query: {
              ...query,
              searchTableTab: `${type}s`,
              filters: JSURL.stringify(
                replaceFilters(
                  {
                    op: 'AND',
                    content: [
                      {
                        op: 'in',
                        content: {
                          field: mainField,
                          value: [`set_id:${setId}`],
                        },
                      },
                    ],
                  },
                  parseFilterParam(query.filters, null),
                ),
              ),
            },
          });
        }}
        filters={{
          op: 'OR',
          content: idFields.map(field => ({
            op: 'in',
            content: {
              field,
              value: hits,
            },
          })),
        }}
      >
        Submit
      </CreateButton>
    );
  },
);
