/* @flow */
/* eslint fp/no-mutating-methods: 0 */

import _ from 'lodash';
import { parseFilterParam } from '../uri';

import type {
  TMergeFilters,
  TCombineValues,
  TMergeFns,
  TMergeQuery,
  TSortFilters,
  TFilterByWhitelist,
  TRemoveFilter,
} from './types';

function compareTerms(a, b) {
  return (
    a.content.field === b.content.field &&
    a.op.toLowerCase() === b.op.toLowerCase()
  );
}

const sortFilters: TSortFilters = (a, b) => {
  if (a.content.field && b.content.field) {
    return a.content.field.localeCompare(b.content.field);
  } else if (a.content.field || b.content.field) {
    return a.content.field ? -1 : 1;
  } else {
    return 0;
  }
};

export const combineValues: TCombineValues = (x, y) => {
  const xValue = [].concat(x.content.value || []);
  const yValue = [].concat(y.content.value || []);

  if (xValue.length === 0 && yValue.length === 0) return null;
  if (xValue.length === 0) return y;
  if (yValue.length === 0) return x;

  const merged = {
    op: x.op,
    content: {
      field: x.content.field,
      value: xValue
        .reduce((acc, v) => {
          if (acc.includes(v)) return acc.filter(f => f !== v);
          return [...acc, v];
        }, yValue)
        .sort(),
    },
  };

  return merged.content.value.length ? merged : null;
};

export const addInValue: TCombineValues = (x, y) => {
  const xValue = [].concat(x.content.value || []);
  const yValue = [].concat(y.content.value || []);

  if (xValue.length === 0 && yValue.length === 0) return null;
  if (xValue.length === 0) return y;
  if (yValue.length === 0) return x;

  const merged = {
    op: 'in',
    content: {
      field: x.content.field,
      value: xValue
        .reduce((acc, v) => {
          if (acc.includes(v)) return acc;
          return [...acc, v];
        }, yValue)
        .sort(),
    },
  };

  return merged.content.value.length ? merged : null;
};

export const toggleFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: 'and',
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(a => compareTerms(a, ctx));
        if (!found) return [...acc, ctx];
        return [
          ...acc.filter(y => y.content.field !== found.content.field),
          combineValues(found, ctx),
        ].filter(Boolean);
      }, q.content)
      .sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

export const replaceFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: 'and',
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(a => compareTerms(a, ctx));
        if (!found) return [...acc, ctx];
        return acc;
      }, q.content)
      .sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

export const addInFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: 'and',
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(a => compareTerms(a, ctx));
        if (!found) return [...acc, ctx];
        return [
          ...acc.filter(y => y.content.field !== found.content.field),
          addInValue(found, ctx),
        ].filter(Boolean);
      }, q.content)
      .sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

export const flipFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const flipped = toggleFilters(
    {
      op: 'and',
      content: q.content.map(f => ({
        ...f,
        op: f.op === 'in' ? 'exclude' : 'in',
      })),
    },
    ctxq,
  );

  const toggled = toggleFilters(q, ctxq);
  const t1 = toggleFilters(flipped, toggled);

  console.log(3333, t1.content);

  console.log(123, toggled.content);

  return null;
  return merged.content.length ? merged : null;
};

const mergeFns: TMergeFns = v => {
  switch (v) {
    case 'toggle':
      return toggleFilters;
    case 'add':
      return addInFilters;
    case 'flip':
      return flipFilters;
    default:
      return replaceFilters;
  }
};

const filterByWhitelist: TFilterByWhitelist = (obj, wls) =>
  Object.keys(obj || {}).reduce(
    (acc, k) =>
      // $FlowIgnore
      wls.includes(k) ? { ...acc, [k]: obj[k] } : acc,
    {},
  );

export const mergeQuery: TMergeQuery = (q, c, mergeType, whitelist) => {
  const ctx = c || {};
  const query = q || {};
  const wlCtx = whitelist ? filterByWhitelist(ctx, whitelist) : ctx;

  // Flow doesn't see that filters is always replaced and complains about ctx.filter being a string
  const mQs: Object = {
    ...wlCtx,
    ...query,
  };

  return {
    ...mQs,
    filters: mergeFns(mergeType)(
      query.filters,
      parseFilterParam(wlCtx.filters, null),
    ),
  };
};

export const setFilter = ({ value, field }) => ({
  op: 'and',
  content: [
    {
      op: 'in',
      content: { field, value },
    },
  ],
});

export const setFilters = filterContent =>
  filterContent.length && {
    op: 'and',
    content: filterContent,
  };

const getDisplayValue = value => {
  switch (typeof value) {
    case 'string':
      return value;
    case 'number':
      return value === 0 ? 'false' : 'true';
    case 'boolean':
      return value ? 'true' : 'false';
    default:
      return value;
  }
};

// true if field and value in
export const inCurrentFilters = ({ currentFilters, key, dotField }) =>
  currentFilters.some(
    f =>
      f.content.field === dotField &&
      f.content.value.map(v => getDisplayValue(v)).includes(key),
  );

// true if field in
export const fieldInCurrentFilters = ({ currentFilters, field }) =>
  currentFilters.some(f => f.content.field === field);

export const getFilterValue = ({ currentFilters, dotField }) =>
  currentFilters.find(f => f.content.field === dotField);

type TMakeFilter = (
  fields: [{ field: string, value: string }],
) => Object | string;
export const makeFilter: TMakeFilter = fields => {
  if (!fields.length) return {};
  return {
    op: 'and',
    content: fields.map(item => {
      const value = _.isArray(item.value) ? item.value : item.value.split(',');

      return {
        op: 'in',
        content: {
          field: item.field,
          value,
        },
      };
    }),
  };
};

export const removeFilter: TRemoveFilter = (field, query) => {
  if (!query) return null;
  if (!field) return query;
  if (Object.keys(query).length === 0) return query;

  if (!Array.isArray(query.content)) {
    const fieldFilter = typeof field === 'function' ? field : f => f === field;
    return fieldFilter(query.content.field) ? null : query;
  }

  const filteredContent = query.content
    .map(q => removeFilter(field, q))
    .filter(Boolean);

  return filteredContent.length
    ? {
        ...query,
        content: filteredContent,
      }
    : null;
};

export default makeFilter;
