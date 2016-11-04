/* @flow */
/* eslint fp/no-mutating-methods: 0 */

import { convertRawToUri } from '../uri';

import type {
  TMergeFilters,
  TCombineValues,
  TMergeFns,
  TMergeQuery,
  TSortFilters,
} from './types';

const sortFilters: TSortFilters = (a, b) => a.content.field.localeCompare(b.content.field);

export const combineValues: TCombineValues = (x, y) => {
  if (x.content.value.length === 0 && y.content.value.length === 0) return null;
  if (x.content.value.length === 0) return y;
  if (y.content.value.length === 0) return x;

  const merged = {
    op: 'in',
    content: {
      field: x.content.field,
      value: x.content.value.reduce((acc, v) => {
        if (acc.includes(v)) return acc.filter(f => f !== v);
        return [...acc, v];
      }, y.content.value).sort(),
    },
  };

  return merged.content.value.length ? merged : null;
};

const toggleFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: 'and',
    content: ctxq.content.reduce((acc, ctx) => {
      const found = acc.find(a => a.content.field === ctx.content.field);
      if (!found) return [...acc, ctx];
      return [
        ...acc.filter(y => y.content.field !== found.content.field),
        combineValues(found, ctx),
      ].filter(Boolean);
    }, q.content).sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

const replaceFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: 'and',
    content: ctxq.content.reduce((acc, x) => {
      const found = acc.find(a => a.content.field === x.content.field);
      if (!found) return [...acc, x];
      return acc;
    }, q.content).sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

const mergeFns: TMergeFns = v => {
  switch (v) {
    case 'toggle': return toggleFilters;
    default: return replaceFilters;
  }
};

export const mergeQuery: TMergeQuery = (q, ctx, mergeType) => {
  const ctxq = convertRawToUri(ctx);

  return {
    ...ctxq,
    ...q,
    filters: (mergeFns(mergeType))(q.filters, ctxq.filters),
  };
};
