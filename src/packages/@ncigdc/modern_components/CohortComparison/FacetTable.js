import React from 'react';
import { compose } from 'recompose';
import { union, find, truncate } from 'lodash';
import ExploreLink from '@ncigdc/components/Links/ExploreLink';
import BarChart from '@ncigdc/components/Charts/TwoBarChart';
import { withTheme } from '@ncigdc/theme';
import Pvalue from '@ncigdc/modern_components/Pvalue';
import { visualizingButton } from '@ncigdc/theme/mixins';
import Button from '@ncigdc/uikit/Button';
import toTsvString from '@ncigdc/utils/toTsvString';
import saveFile from '@ncigdc/utils/filesaver';
import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

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
    Alias,
    palette,
    heading,
  }) => {
    const buckets1 = data1[field].buckets.filter(x => x.key !== '_missing');
    const buckets2 = data2[field].buckets.filter(x => x.key !== '_missing');
    const tableData = union(
      buckets1.map(b => b.key),
      buckets2.map(b => b.key),
    ).map(k => {
      const casesS1 = (find(buckets1, b => b.key === k) || {}).doc_count || 0;
      const casesS2 = (find(buckets2, b => b.key === k) || {}).doc_count || 0;

      return {
        value: k,
        casesS1,
        percentS1: (casesS1 / result1.hits.total * 100).toFixed(0),
        casesS2,
        percentS2: (casesS2 / result2.hits.total * 100).toFixed(0),
      };
    });

    return (
      <div>
        <h2>{heading}</h2>
        <BarChart
          data1={tableData.map(({ value, casesS1 }) => ({
            label: truncate(value, { length: 15 }),
            value: casesS1,
          }))}
          data2={tableData.map(({ value, casesS2 }) => ({
            label: truncate(value, { length: 15 }),
            value: casesS2,
          }))}
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
        <EntityPageHorizontalTable
          rightComponent={
            <Button
              style={{ ...visualizingButton }}
              onClick={() =>
                saveFile(
                  toTsvString(tableData),
                  'TSV',
                  `${heading}-comparison.tsv`,
                )}
            >
              TSV
            </Button>
          }
          headings={[
            { key: 'value', title: heading, tdStyle: { maxWidth: 250 } },
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
                        {
                          op: 'in',
                          content: {
                            field,
                            value: [row.value],
                          },
                        },
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
                        {
                          op: 'in',
                          content: {
                            field,
                            value: [row.value],
                          },
                        },
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
          {[buckets1.length, buckets2.length].every(l => l === 2) && (
            <Pvalue
              data={[
                buckets1.map(x => x.doc_count),
                buckets2.map(x => x.doc_count),
              ]}
            />
          )}
        </div>
      </div>
    );
  },
);
