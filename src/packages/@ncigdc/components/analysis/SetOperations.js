import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import Venn from '@ncigdc/components/Charts/Venn';
import { Row, Column } from '@ncigdc/uikit/Flex';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { ExploreCaseCount, GeneCount } from '@ncigdc/modern_components/Counts';

const countComponents = {
  case: ExploreCaseCount,
  gene: GeneCount,
};

export default compose(
  connect(s => ({ sets: s.sets })),
  withState('selected', 'setSelected', new Set()),
)(({ setIds, sets, type, selected, setSelected }) => {
  const setData = Object.entries(sets[type]).filter(([setId]) =>
    setIds.map(x => x.split(':')[1]).includes(setId),
  );

  const CountComponent = countComponents[type];

  const ops = [
    {
      op: '( S1 ∩ S2 ∩ S3 )',
      selected: selected.has(this.op),
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: setData.map(([setId]) => ({
              op: 'in',
              content: {
                field: `${type}s.${type}_id`,
                value: `set_id:${setId}`,
              },
            })),
          }}
        />
      ),
    },
    {
      op: '( S1 ∩ S2 ) − ( S3 )',
      selected: selected.has(this.op),
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              ...setData.slice(0, 2).map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[2][0]}`,
                },
              },
            ],
          }}
        />
      ),
    },
    {
      op: '( S1 ∩ S3 ) − ( S2 )',
      selected: selected.has(this.op),
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              ...[setData[0], setData[2]].map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[1][0]}`,
                },
              },
            ],
          }}
        />
      ),
    },
    {
      op: '( S2 ∩ S3 ) − ( S1 )',
      selected: selected.has(this.op),
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              ...[setData[1], setData[2]].map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[0][0]}`,
                },
              },
            ],
          }}
        />
      ),
    },
    {
      op: '( S1 ) − ( S2 ∪ S3 )',
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[0][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[1][0]}`, `set_id:${setData[2][0]}`],
                },
              },
            ],
          }}
        />
      ),
    },
    {
      op: '( S2 ) − ( S1 ∪ S3 )',
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[1][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[0][0]}`, `set_id:${setData[2][0]}`],
                },
              },
            ],
          }}
        />
      ),
    },
    {
      op: '( S3 ) − ( S1 ∪ S2 )',
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[2][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[0][0]}`, `set_id:${setData[1][0]}`],
                },
              },
            ],
          }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ fontSize: 20 }}>Set Operations</div>
      <div>
        Click on the areas of the Venn diagram to include them in your
        result set.
      </div>
      <Column>
        <Row>
          <Venn data={setIds} getFillColor={d => null} />
          <Column spacing="2rem">
            <EntityPageHorizontalTable
              data={setData.map(([setId, label], i) => {
                const id = `set-table-${type}-${setId}-select`;
                return {
                  id,
                  alias: <span><em>S</em><sub>{i + 1}</sub></span>,
                  name: (
                    <label htmlFor={id}>
                      {_.truncate(label, { length: 70 })}
                    </label>
                  ),
                  type,
                  count: (
                    <CountComponent
                      filters={{
                        op: '=',
                        content: {
                          field: `${type}s.${type}_id`,
                          value: `set_id:${setId}`,
                        },
                      }}
                    />
                  ),
                };
              })}
              headings={[
                { key: 'alias', title: 'Alias' },
                { key: 'name', title: 'Name', style: { width: 100 } },
                {
                  key: 'count',
                  title: '# Items',
                  style: { textAlign: 'right' },
                },
                { key: 'type', title: 'Item Type' },
              ]}
            />
            <EntityPageHorizontalTable
              data={ops}
              headings={[
                { key: 'select', title: 'Select' },
                { key: 'op', title: 'Set Operation' },
                {
                  key: 'count',
                  title: '# Items',
                  style: { textAlign: 'right' },
                },
                { key: 'actions', title: 'Actions' },
              ]}
            />
          </Column>
        </Row>
      </Column>
    </div>
  );
});
