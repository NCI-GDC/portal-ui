// @flow
import React from 'react';
import memoize from 'memoizee';
import queryString from 'query-string';
import _ from 'lodash';

import { replaceFilters } from '@ncigdc/utils/filters';
import styled from '@ncigdc/theme/styled';
import { fetchApi } from '@ncigdc/utils/ajax/index';
import { performanceTracker } from '@ncigdc/utils/analytics';

type TPropsDefault = { slug?: string, currentFilters?: Object, size?: number };
type TPropsMulti = {
  value: string,
  field: string,
  slug?: string,
  currentFilters?: Object,
  size?: number,
};

const MINIMUM_CASES = 10;

const Symbol = styled.span({
  fontSize: '1.2em',
});

export const enoughData = (data: Object) =>
  data &&
  data.results &&
  data.results.length &&
  data.results.every(r => r.donors.length >= MINIMUM_CASES);

async function fetchCurves(
  filters: ?Array<Object>,
  size: number,
): Promise<Object> {
  const params = _.omitBy(
    { filters: filters && JSON.stringify(filters), size },
    _.isNil,
  );
  const url = `analysis/survival?${queryString.stringify(params)}`;
  performanceTracker.begin('survival:fetch');
  const rawData = await fetchApi(url);
  performanceTracker.end('survival:fetch', {
    filters: params.filters,
    data_sets: rawData.results.length,
    donors: _.sum(rawData.results.map(x => x.donors.length)),
  });
  return enoughData(rawData) ? rawData : { results: [] };
}

export const getDefaultCurve = memoize(
  async ({ slug, currentFilters, size }: TPropsDefault): Promise<Object> => {
    const rawData = await fetchCurves(
      Array.isArray(currentFilters) ? currentFilters : [currentFilters],
      size,
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
    value,
    field,
    slug,
    currentFilters,
    size,
  }: TPropsMulti): Promise<Object> => {
    const filters = [
      replaceFilters(
        {
          op: 'and',
          content: [{ op: 'excludeifany', content: { field, value } }],
        },
        currentFilters,
      ),
      replaceFilters(
        { op: 'and', content: [{ op: '=', content: { field, value } }] },
        currentFilters,
      ),
    ];

    const rawData = await fetchCurves(filters, size);
    const hasEnoughData = enoughData(rawData);

    return {
      rawData: {
        ...rawData,
        results: rawData.results.map((r, idx) => ({
          ...r,
          meta: {
            ...r.meta,
            label: `S${idx + 1}`,
          },
        })),
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
                  {' '}
                  (N =
                  {' '}
                  {rawData.results[0].donors.length.toLocaleString()}
                  ) -
                  {' '}
                  <Symbol>{slug || value}</Symbol>
                  {' '}
                  Not Mutated Cases
                </span>
              ),
            },
            {
              key: `${slug || value}-mutated`,
              value: (
                <span>
                  S
                  <sub>2</sub>
                  {' '}
                  (N =
                  {' '}
                  {rawData.results[1].donors.length.toLocaleString()}
                  ) -
                  {' '}
                  <Symbol>{slug || value}</Symbol>
                  {' '}
                  Mutated Cases
                </span>
              ),
            },
          ]
        : [
            {
              key: `${slug || value}-not-enough-data`,
              value: <span>Not enough survival data for {slug || value}</span>,
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
