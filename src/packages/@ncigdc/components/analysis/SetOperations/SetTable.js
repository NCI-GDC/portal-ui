import React from 'react';
import _ from 'lodash';
import { stringifyJSONParam } from '@ncigdc/utils/uri';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Tooltip } from '@ncigdc/uikit/Tooltip';

const Alias = ({ i }) => <span><em>S</em><sub>{i}</sub></span>;

export default ({ push, setData, type, CountComponent, CreateSetButton }) =>
  <EntityPageHorizontalTable
    data={setData.map(([setId, label], i) => {
      const id = `set-table-${type}-${setId}-select`;
      return {
        id,
        alias: <Alias i={i + 1} />,
        name: (
          <label htmlFor={id}>
            {_.truncate(label, { length: 70 })}
          </label>
        ),
        type: _.capitalize(type === 'ssm' ? 'Mutation' : type) + 's',
        count: (
          <CountComponent
            filters={{
              op: '=',
              content: {
                field: `${type}s.${type}_id`,
                value: `set_id:${setId}`,
              },
            }}
          >
            {count =>
              count === 0
                ? 0
                : <CreateSetButton
                    filters={{
                      op: '=',
                      content: {
                        field: `${type}s.${type}_id`,
                        value: `set_id:${setId}`,
                      },
                    }}
                    onComplete={setId => {
                      push({
                        pathname: '/exploration',
                        query: {
                          searchTableTab:
                            (type === 'ssm' ? 'mutation' : type) + 's',
                          filters: stringifyJSONParam({
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
                          }),
                        },
                      });
                    }}
                    Component={p =>
                      <Tooltip Component={`View ${type} set in exploration`}>
                        <span
                          {...p}
                          style={{
                            cursor: 'pointer',
                            color: 'rgb(43, 118, 154)',
                            textDecoration: 'underline',
                          }}
                        >
                          {count.toLocaleString()}
                        </span>
                      </Tooltip>}
                  />}
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
  />;
