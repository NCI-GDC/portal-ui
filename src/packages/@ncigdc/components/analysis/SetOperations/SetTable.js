import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

const Alias = ({ i }) => (
  <span>
    <em>S</em>
    <sub>{i}</sub>
  </span>
);

const enhance = compose(
  connect((state, props) => ({ sets: state.sets[props.type] })),
);
export default enhance(
  ({ push, setIds, type, CountComponent, CreateSetButton, sets }) => (
    <EntityPageHorizontalTable
      data={setIds.map((setId, i) => {
        const id = `set-table-${type}-${setId}-select`;
        return {
          id,
          alias: <Alias i={i + 1} />,
          name: (
            <label htmlFor={id}>
              {_.truncate(sets[setId] || 'deleted set', { length: 70 })}
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
                count === 0 ? (
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
