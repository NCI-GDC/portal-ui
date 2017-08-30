import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';
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
)(({ setIds, sets, type }) => {
  const setData = Object.entries(sets[type]).filter(([setId]) =>
    setIds.map(x => x.split(':')[1]).includes(setId),
  );

  const CountComponent = countComponents[type];

  const ops = [
    {
      op: '( S1 ∩ S2 ∩ S3 )',
      count: (
        <CountComponent
          filters={{
            op: 'and',
            content: setData.map(([setId]) => ({
              field: `${type}s.${type}_id`,
              value: `set_id:${setId}`,
            })),
          }}
        />
      ),
    },
    // {
    //   op: '( S1 ∩ S2 ) − ( S3 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
    // {
    //   op: '( S1 ∩ S3 ) − ( S2 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
    // {
    //   op: '( S2 ∩ S3 ) − ( S1 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
    // {
    //   op: '( S1 ) − ( S2 ∪ S3 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
    // {
    //   op: '( S2 ) − ( S1 ∪ S3 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
    // {
    //   op: '( S3 ) − ( S1 ∪ S2 )',
    //   count: (
    //     <CountComponent
    //       filters={{
    //         op: '=',
    //         content: {
    //           field: `${type}s.${type}_id`,
    //           value: `set_id:${setId}`,
    //         },
    //       }}
    //     />
    //   ),
    // },
  ];

  return (
    <div>
      <div style={{ fontSize: 20 }}>Set Operations</div>
      <div>
        Click on the areas of the Venn diagram to include them in your
        result set.
      </div>

      <Column>
        <Row>
          <Venn data={setIds} />
          <Column spacing="2rem">
            <EntityPageHorizontalTable
              data={setData.map(([setId, label], i) => {
                const id = `set-table-${type}-${setId}-select`;
                return {
                  id,
                  alias: <span><em>S</em><sub>{i + 1}</sub></span>,
                  name: (
                    <label htmlFor={id}>
                      {label}
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
                { key: 'name', title: 'Name' },
                {
                  key: 'count',
                  title: '# Items',
                  style: { textAlign: 'right' },
                },
                { key: 'type', title: 'Item Type' },
              ]}
            />
            {/* <EntityPageHorizontalTable
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
            /> */}
          </Column>
        </Row>
      </Column>
    </div>
  );
});
