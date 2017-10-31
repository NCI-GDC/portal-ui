import React from 'react';
import { compose } from 'recompose';
import { uniq } from 'lodash';

import { replaceFilters } from '@ncigdc/utils/filters';
import { parseFilterParam, stringifyJSONParam } from '@ncigdc/utils/uri';
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
    mainField,
    type,
    CreateButton,
    idMap,
    idKey,
    ...props
  }: TProps) => {
    return (
      <CreateButton
        {...props}
        disabled={!hits.length}
        onComplete={setId => {
          onClose();
          push({
            query: {
              ...query,
              filters: stringifyJSONParam(
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
          op: 'and',
          content: [
            {
              op: 'in',
              content: {
                field: mainField,
                value: uniq(hits.map(h => idMap[h][idKey])),
              },
            },
          ],
        }}
      >
        Submit
      </CreateButton>
    );
  },
);
