import React from 'react';
import memoize from 'memoizee';
import queryString from 'query-string';
import {
  get,
  isNil,
  omitBy,
  sum,
} from 'lodash';
import { scaleOrdinal, schemeCategory10 } from 'd3';

import { replaceFilters } from '@ncigdc/utils/filters';
import styled from '@ncigdc/theme/styled';
import { fetchApi } from '@ncigdc/utils/ajax/index';
import { performanceTracker } from '@ncigdc/utils/analytics';
import { DAYS_IN_YEAR } from '@ncigdc/utils/ageDisplay';

type TPropsDefault = { slug?: string, currentFilters?: Object, size?: number };
type TPropsMulti = {
  value: string,
  field: string,
  slug?: string,
  currentFilters?: Object,
  size?: number,
};

export const MINIMUM_CASES = 10;
export const MAXIMUM_CURVES = 5;

const colors = scaleOrdinal(schemeCategory10);
export const SURVIVAL_PLOT_COLORS = [
  colors(0),
  colors(1),
  colors(2),
  colors(3),
  colors(4),
];

const Symbol = styled.span({
  fontSize: '1.2em',
});

export const enoughData = (data: Object) => data &&
  data.results &&
  data.results.length &&
  data.results.every(r => r.donors.length >= MINIMUM_CASES);

const enoughDataOnSomeCurves = (data: Object) => data &&
  data.results &&
  data.results.length &&
  data.results.some(r => r.donors.length >= MINIMUM_CASES);

async function fetchCurves(
  filters: ?Array<Object>,
  size: number,
  hasMultipleCurves: Boolean,
  {
    addControlledAccessParams = () => ({}),
    requiresStudy = '',
  },
): Promise<Object> {
  // This function will also log queries out in dev mode.
  const { study } = addControlledAccessParams(
    requiresStudy,
    requiresStudy,
  );
  const params = omitBy(
    {
      filters: filters && JSON.stringify(filters),
      size,
      ...study ? { study: JSON.stringify(study) } : {},
    },
    isNil,
  );

  performanceTracker.begin('survival:fetch');
  const rawData = await fetchApi(queryString.stringifyUrl({
    query: params,
    url: 'analysis/survival',
  }));
  const hasEnoughData = hasMultipleCurves
    ? enoughDataOnSomeCurves(rawData)
    : enoughData(rawData);
  const data = hasEnoughData
    ? {
      ...rawData,
      results: rawData.results.map(r => ({
        ...r,
        donors: r.donors.map(d => ({
          ...d,
          time: d.time / DAYS_IN_YEAR,
        })),
      })),
    }
    : { results: [] };

  performanceTracker.end('survival:fetch', {
    filters: params.filters,
    data_sets: data.results.length,
    donors: sum(data.results.map(x => x.donors.length)),
  });

  return data;
}

export const getDefaultCurve = memoize(
  async ({
    addControlledAccessParams,
    currentFilters,
    size,
    slug = 'unsluggedSurvivalPlot',
  }: TPropsDefault): Promise<Object> => {
    const rawData = await fetchCurves(
      Array.isArray(currentFilters)
        ? currentFilters
        : currentFilters && [currentFilters],
      size,
      null,
      {
        addControlledAccessParams,
        requiresStudy: `${slug}${addControlledAccessParams ? 'RequiresStudy' : ''}`,
      },
    );
    const hasEnoughData = enoughData(rawData);

    const legend = hasEnoughData
      ? slug && [
        {
          key: slug,
          value: `${rawData.results[0].donors.length.toLocaleString()} Cases with Survival Data`,
        },
      ]
      : [
        {
          key: `${slug || ''}-not-enough-data`,
          value: <span>Not enough survival data</span>,
        },
      ];
    return {
      rawData,
      id: slug,
      legend,
    };
  },
  {
    max: 10,
    promise: true,
    normalizer: args => JSON.stringify(args[0]),
  },
);

export const getSurvivalCurves = memoize(
  async ({
    currentFilters,
    field,
    plotType,
    size,
    slug,
    value,
  }: TPropsMulti): Promise<Object> => {
    const filters = [
      replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: 'excludeifany',
              content: {
                field,
                value,
              },
            },
          ],
        },
        currentFilters,
      ),
      replaceFilters(
        {
          op: 'and',
          content: [
            {
              op: '=',
              content: {
                field,
                value,
              },
            },
          ],
        },
        currentFilters,
      ),
    ];

    const rawData = await fetchCurves(filters, size);
    const hasEnoughData = enoughData(rawData);
    const results2 = get(rawData, 'results[1].donors', []);
    const results1 = get(rawData, 'results[0].donors', []);

    const getCaseCount = condition => (condition
      ? results1.length.toLocaleString()
      : results2.length.toLocaleString());

    return {
      rawData: {
        ...rawData,
        results:
          rawData.results.length > 1
            ? rawData.results.map((r, idx) => ({
              ...r,
              meta: {
                ...r.meta,
                label: `S${idx + 1}`,
              },
            }))
            : [],
      },
      id: value,
      legend: hasEnoughData
        ? [
          {
            key: `${slug || value}-not-mutated`,
            value: (
              <span>
                S
                <sub>1</sub>
                {` (N = ${getCaseCount(results2.length > 0)})`}
                {plotType === 'mutation' && (
                  <span>
                    {' - '}
                    <Symbol>{slug || value}</Symbol>
                    {' Not Mutated Cases'}
                  </span>
                )}
              </span>
            ),
          },
          {
            key: `${slug || value}-mutated`,
            value: (
              <span>
                S
                <sub>2</sub>
                {` (N = ${getCaseCount(results2.length === 0)})`}
                {plotType === 'mutation' && (
                  <span>
                    {' - '}
                    <Symbol>{slug || value}</Symbol>
                    {' Mutated Cases'}
                  </span>
                )}
              </span>
            ),
          },
          ...(results2.length === 0
            ? [
              {
                key: `${slug || value}-cannot-compare`,
                value: (
                  <div>
                    <span>Not enough data to compare</span>
                  </div>
                ),
                style: {
                  width: '100%',
                  marginTop: 5,
                },
              },
            ]
            : []),
        ]
        : [
          {
            key: `${slug || value}-not-enough-data`,
            value: (
              <span>
                {`Not enough survival data for ${slug || value}`}
              </span>),
          },
        ],
    };
  },
  {
    max: 10,
    promise: true,
    normalizer: args => JSON.stringify(args[0]),
  },
);

export const getSurvivalCurvesArray = memoize(
  async ({
    values = [],
    field,
    currentFilters,
    size,
    plotType,
  }: TPropsMulti): Promise<Object> => {
    const filters = values.slice(0, MAXIMUM_CURVES).map(
      value => {
        return plotType === 'continuous'
        ? value.filters
        : replaceFilters(
          {
            op: 'and',
            content: [
              {
                op: '=',
                content: {
                  field,
                  value: value.keyArray,
                },
              },
            ],
          },
          currentFilters,
        );
      },
    );

    const rawData = await fetchCurves(filters, size, true);
    const hasEnoughDataOnSomeCurves = enoughDataOnSomeCurves(rawData);

    const getCaseCount = i => get(rawData, `results[${i}].donors`, []).length.toLocaleString();

    return {
      id: field,
      legend: hasEnoughDataOnSomeCurves
        ? rawData.results.map((r, i) => {
          const valueName = plotType === 'categorical'
            ? values[i].keyName
            : values[i].key;
          return r.length === 0
            ? {
              key: `${valueName}-cannot-compare`,
              style: {
                marginTop: 5,
                width: '100%',
              },
              value: (
                <div>
                  <span>Not enough data to compare</span>
                </div>
              ),
            }
            : r.donors.length < MINIMUM_CASES
              ? {
                key: `${valueName}-not-enough-data`,
                value: (
                  <span>
                    {`Not enough survival data for ${valueName}`}
                  </span>
                ),
              }
              : {
                key: valueName,
                value: (
                  <span>
                    S
                    <sub>{i + 1}</sub>
                    {` (N = ${getCaseCount(i)})`}
                    <span className="print-only inline">
                      {` - ${valueName}`}
                    </span>
                  </span>
                ),
              };
        })
        : [
          {
            key: `${field}-not-enough-data`,
            value: <span>Not enough survival data for this facet</span>,
          },
        ],
      rawData: {
        ...rawData,
        results:
          rawData.results.length > 0
            ? rawData.results
              .map((r, idx) => ({
                ...r,
                meta: {
                  ...r.meta,
                  label: `S${idx + 1}`,
                },
              }))
            : [],
      },
    };
  },
  {
    max: 10,
    promise: true,
    normalizer: args => JSON.stringify(args[0]),
  },
);
