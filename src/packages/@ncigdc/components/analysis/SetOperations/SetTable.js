import React from 'react';
import _ from 'lodash';
import { compose } from 'recompose';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import Alias from '@ncigdc/components/Alias';

const enhance = compose(); // left to minimize diff
export default enhance(
  ({ push, type, CountComponent, CreateSetButton, sets, setSetSize }) => (
    <EntityPageHorizontalTable
      data={Object.entries(sets).map(([setId, label], i) => {
        const id = `set-table-${type}-${setId}-select`;
        return {
          id,
          alias: <Alias i={i + 1} />,
          name: <label htmlFor={id}>{_.truncate(label, { length: 70 })}</label>,
          type: _.capitalize(type === 'ssm' ? 'Mutation' : type) + 's',
          count: (
            <CountComponent
              handleCountChange={count => setSetSize({ setId, size: count })}
              filters={{
                op: '=',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              }}
            >
              {count => (
                <span>
                  {count === 0 ? (
                    0
                  ) : (
                    <ExploreLink
                      query={{
                        searchTableTab:
                          (type === 'ssm' ? 'mutation' : type) + 's',
                        filters: {
                          op: 'AND',
                          content: [
                            {
                              op: 'IN',
                              content: {
                                field: `${type}s.${type}_id`,
                                value: [`set_id:${setId}`],
                              },
                            },
                          ],
                        },
                      }}
                    >
                      {count.toLocaleString()}
                    </ExploreLink>
                  )}
                </span>
              )}
            </CountComponent>
          ),
        };
      })}
      headings={[
        { key: 'alias', title: 'Alias' },
        { key: 'type', title: 'Item Type' },
        { key: 'name', title: 'Name', style: { width: 100 } },
        {
          key: 'count',
          title: '# Items',
          style: { textAlign: 'right' },
        },
      ]}
    />
  ),
);
