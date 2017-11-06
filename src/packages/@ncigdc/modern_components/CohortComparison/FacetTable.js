import React from 'react';
import { compose } from 'recompose';
import { union, find, truncate, get, omit } from 'lodash';

import type { TBucket } from './types';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import BarChart from '@ncigdc/components/Charts/TwoBarChart';
import { withTheme } from '@ncigdc/theme';
import Pvalue from '@ncigdc/modern_components/Pvalue';
import Alias from '@ncigdc/components/Alias';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Button from '@ncigdc/uikit/Button';
import toTsvString from '@ncigdc/utils/toTsvString';
import saveFile from '@ncigdc/utils/filesaver';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';
import { Tooltip } from '../../uikit/Tooltip/index';

function barChartData({ term, value, name, percent }) {
  return {
    label: truncate(term, { length: 15 }),
    value,
    tooltip: (
      <div>
        <strong>{name}</strong>
        <br />
        {percent}% Cases ({value.toLocaleString()})
      </div>
    ),
  };
}

const addMissing = ({
  buckets,
  total,
}: {
  buckets: Array<TBucket>,
  total: number,
}) => [
  ...buckets,
  {
    key: '_missing',
    doc_count:
      total - buckets.reduce((acc, { doc_count }) => acc + doc_count, 0),
  },
];

export default compose(
  withTheme,
)(
  ({
    theme,
    field,
    data1,
    data2,
    result1,
    result2,
    set1,
    set2,
    setName1,
    setName2,
    palette,
    heading,
  }: {
    theme: Object,
    field: string,
    data1: { buckets: Array<TBucket> },
    data2: { buckets: Array<TBucket> },
    result1: { hits: { total: number }, facets: string, aggregations: any },
    result2: { hits: { total: number }, facets: string, aggregations: any },
    set1: string,
    set2: string,
    setName1: string,
    setName2: string,
    palette: Array<any>,
    heading: string,
  }) => {
    const buckets1Raw = get(data1, `['${field}'].buckets`, []);
    const buckets2Raw = get(data2, `['${field}'].buckets`, []);

    // can't get _missing back from es aggs if field is nested or agg type histogram
    // so calculate missing from the total if no _missing key
    const buckets1 = buckets1Raw.includes(({ key }) => key === '_missing')
      ? buckets1Raw
      : addMissing({
          buckets: buckets1Raw,
          total: result1.hits.total,
        });
    const buckets2 = buckets2Raw.includes(({ key }) => key === '_missing')
      ? buckets2Raw
      : addMissing({
          buckets: buckets2Raw,
          total: result2.hits.total,
        });

    const tableData = union(
      buckets1.map(b => b.key),
      buckets2.map(b => b.key),
    ).map(k => {
      const bucket1 = find(buckets1, b => b.key === k) || {};
      const bucket2 = find(buckets2, b => b.key === k) || {};

      const casesS1 = bucket1.doc_count || 0;
      const casesS2 = bucket2.doc_count || 0;

      return {
        term: k,
        casesS1,
        percentS1: (casesS1 / result1.hits.total * 100).toFixed(2),
        filters1: bucket1.filters,
        casesS2,
        percentS2: (casesS2 / result2.hits.total * 100).toFixed(2),
        filters2: bucket2.filters,
      };
    });

    const noDataKeys = ['_missing', 'not reported', 'unknown'];
    const pValueBuckets = [
      buckets1.filter(({ key }) => !noDataKeys.includes(key)),
      buckets2.filter(({ key }) => !noDataKeys.includes(key)),
    ];

    return (
      <div>
        <h2>{heading}</h2>
        <div
          style={{
            maxWidth: tableData.length * 140 + 150, // TODO: use same logic used in TwoBarCharts
          }}
        >
          <BarChart
            minBarHeight={1}
            data1={tableData.map(
              ({ term, casesS1: value, percentS1: percent }) =>
                barChartData({ term, value, name: setName1, percent }),
            )}
            data2={tableData.map(
              ({ term, casesS2: value, percentS2: percent }) =>
                barChartData({ term, value, name: setName2, percent }),
            )}
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
        </div>
        <EntityPageHorizontalTable
          rightComponent={
            <Button
              style={{ ...visualizingButton }}
              onClick={() =>
                saveFile(
                  toTsvString(
                    tableData.map(d =>
                      omit(
                        {
                          ...d,
                          [heading]: d.term,
                          '# Cases S1': d.casesS1,
                          '% Cases S1': d.percentS1,
                          '# Cases S2': d.casesS2,
                          '% Cases S2': d.percentS2,
                        },
                        [
                          'term',
                          'casesS1',
                          'casesS2',
                          'percentS1',
                          'percentS2',
                          'filters1',
                          'filters2',
                        ],
                      ),
                    ),
                  ),
                  'TSV',
                  `${heading}-comparison.tsv`,
                )}
            >
              TSV
            </Button>
          }
          headings={[
            { key: 'term', title: heading, tdStyle: { maxWidth: 250 } },
            {
              key: 'casesS1',
              title: (
                <span>
                  # Cases <Alias i={1} />
                </span>
              ),
              style: { textAlign: 'right' },
            },
            {
              key: 'percentS1',
              title: '%',
              style: { textAlign: 'right' },
            },
            {
              key: 'casesS2',
              title: (
                <span>
                  # Cases <Alias i={2} />
                </span>
              ),
              style: { textAlign: 'right' },
            },
            {
              key: 'percentS2',
              title: '%',
              style: { textAlign: 'right' },
            },
          ]}
          data={tableData.map(row => ({
            ...row,
            casesS1:
              row.casesS1 === 0 ? (
                0
              ) : (
                <ExploreLink
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
                        ...(row.filters1
                          ? row.filters1
                          : [
                              {
                                op: row.term === '_missing' ? 'is' : 'in',
                                content: {
                                  field: `cases.${field}`,
                                  value: [row.term],
                                },
                              },
                            ]),
                      ],
                    },
                  }}
                >
                  {row.casesS1.toLocaleString()}
                </ExploreLink>
              ),
            percentS1: `${row.percentS1}%`,
            casesS2:
              row.casesS2 === 0 ? (
                0
              ) : (
                <ExploreLink
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
                        ...(row.filters2
                          ? row.filters2
                          : [
                              {
                                op: row.term === '_missing' ? 'is' : 'in',
                                content: {
                                  field: `cases.${field}`,
                                  value: [row.term],
                                },
                              },
                            ]),
                      ],
                    },
                  }}
                >
                  {row.casesS2}
                </ExploreLink>
              ),
            percentS2: `${row.percentS2}%`,
          }))}
        />
        <div style={{ textAlign: 'right' }}>
          {pValueBuckets.every(b => b.length === 2) && (
            <Tooltip
              Component={`P-Value for ${pValueBuckets[0][0]
                .key} and ${pValueBuckets[0][1].key}`}
            >
              <Pvalue
                data={pValueBuckets.map(buckets =>
                  buckets.map(x => x.doc_count),
                )}
              />
            </Tooltip>
          )}
        </div>
      </div>
    );
  },
);
