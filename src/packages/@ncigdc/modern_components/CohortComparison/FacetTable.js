import React from 'react';
import { compose } from 'recompose';
import { union, find } from 'lodash';
import Table, { Tr, Td, Th } from '@ncigdc/uikit/Table';
import { Row } from '@ncigdc/uikit/Flex';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import BarChart from '@ncigdc/components/Charts/TwoBarChart';
import { withTheme } from '@ncigdc/theme';

export default compose(
  withTheme,
)(
  ({
    theme,
    mapping,
    field,
    data1,
    data2,
    result1,
    result2,
    Set1,
    Set2,
    set1,
    set2,
    Alias,
    palette,
    data = union(
      data1[field].buckets.map(b => b.key),
      data2[field].buckets.map(b => b.key),
    ),
  }) =>
    <div>
      <Row>
        <h2>{mapping[field]}</h2>
        {/* <Row style={{ marginLeft: 'auto', alignItems: 'center' }}>
        <div>{Set1}</div>
        <div style={{ margin: '0 10px' }}>{Set2}</div>
      </Row> */}
      </Row>
      <BarChart
        data1={data.map(k => {
          const bucket = find(data1[field].buckets, b => b.key === k) || {};

          return {
            label: k,
            value: bucket.doc_count || 0,
          };
        })}
        data2={data.map(k => {
          const bucket = find(data2[field].buckets, b => b.key === k) || {};

          return {
            label: k,
            value: bucket.doc_count || 0,
          };
        })}
        yAxis={{ title: '# Cases' }}
        height={200}
        styles={{
          xAxis: {
            stroke: theme.greyScale4,
            textFill: theme.greyScale3,
          },
          yAxis: {
            stroke: theme.greyScale4,
            textFill: theme.greyScale3,
          },
          bars1: { fill: palette[0] },
          bars2: { fill: palette[1] },
          tooltips: {
            fill: '#fff',
            stroke: theme.greyScale4,
            textFill: theme.greyScale3,
          },
        }}
      />
      <Table
        headings={[
          <Th key="1">{mapping[field]}</Th>,
          <Th key="2" style={{ textAlign: 'right' }}>
            # Cases <Alias i={1} />
          </Th>,
          <Th key="3" style={{ textAlign: 'right' }}>%</Th>,
          <Th key="4" style={{ textAlign: 'right' }}>
            # Cases <Alias i={2} />
          </Th>,
          <Th key="5" style={{ textAlign: 'right' }}>%</Th>,
        ]}
        body={
          <tbody>
            {data.map((k, i) => {
              const set1_bucket =
                find(data1[field].buckets, b => b.key === k) || {};
              const set2_bucket =
                find(data2[field].buckets, b => b.key === k) || {};

              return (
                <Tr key={k} index={i}>
                  <Td width={250}>{k}</Td>
                  <Td style={{ textAlign: 'right' }}>
                    {(set1_bucket.doc_count || 0) === 0
                      ? 0
                      : <ExploreLink
                          query={{
                            searchTableTab: 'cases',
                            filters: {
                              op: 'and',
                              content: [
                                {
                                  op: 'in',
                                  content: {
                                    field: 'cases.case_id',
                                    value: [`set_id:${set1}`],
                                  },
                                },
                                {
                                  op: 'in',
                                  content: {
                                    field,
                                    value: [set1_bucket.key],
                                  },
                                },
                              ],
                            },
                          }}
                        >
                          {(set1_bucket.doc_count || 0).toLocaleString()}
                        </ExploreLink>}
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    {((set1_bucket.doc_count || 0) /
                      result1.hits.total *
                      100).toFixed(0)}%
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    {(set2_bucket.doc_count || 0) === 0
                      ? 0
                      : <ExploreLink
                          query={{
                            searchTableTab: 'cases',
                            filters: {
                              op: 'and',
                              content: [
                                {
                                  op: 'in',
                                  content: {
                                    field: 'cases.case_id',
                                    value: [`set_id:${set2}`],
                                  },
                                },
                                {
                                  op: 'in',
                                  content: {
                                    field,
                                    value: [set2_bucket.key],
                                  },
                                },
                              ],
                            },
                          }}
                        >
                          {(set2_bucket.doc_count || 0).toLocaleString()}
                        </ExploreLink>}
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    {((set2_bucket.doc_count || 0) /
                      result2.hits.total *
                      100).toFixed(0)}%
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        }
      />
    </div>,
);
