/* @flow */
/* eslint fp/no-mutating-methods: 0 */

import _ from "lodash";
import { parseFilterParam } from "../uri";

import type {
  TMergeFilters,
  TCombineValues,
  TMergeFns,
  TMergeQuery,
  TSortFilters,
  TFilterByWhitelist
} from "./types";

const sortFilters: TSortFilters = (a, b) =>
  a.content.field.localeCompare(b.content.field);

export const combineValues: TCombineValues = (x, y) => {
  if (x.content.value.length === 0 && y.content.value.length === 0) return null;
  if (x.content.value.length === 0) return y;
  if (y.content.value.length === 0) return x;

  const merged = {
    op: "in",
    content: {
      field: x.content.field,
      value: x.content.value
        .reduce((acc, v) => {
          if (acc.includes(v)) return acc.filter(f => f !== v);
          return [...acc, v];
        }, y.content.value)
        .sort()
    }
  };

  return merged.content.value.length ? merged : null;
};

export const addInValue: TCombineValues = (x, y) => {
  if (x.content.value.length === 0 && y.content.value.length === 0) return null;
  if (x.content.value.length === 0) return y;
  if (y.content.value.length === 0) return x;

  const merged = {
    op: "in",
    content: {
      field: x.content.field,
      value: x.content.value
        .reduce((acc, v) => {
          if (acc.includes(v)) return acc;
          return [...acc, v];
        }, y.content.value)
        .sort()
    }
  };

  return merged.content.value.length ? merged : null;
};

export const toggleFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: "and",
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(
          a => a.content.field === ctx.content.field && a.op === ctx.op
        );
        if (!found) return [...acc, ctx];
        return [
          ...acc.filter(y => y.content.field !== found.content.field),
          combineValues(found, ctx)
        ].filter(Boolean);
      }, q.content)
      .sort(sortFilters)
  };

  return merged.content.length ? merged : null;
};

export const replaceFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: "and",
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(
          a => a.content.field === ctx.content.field && a.op === ctx.op
        );
        if (!found) return [...acc, ctx];
        return acc;
      }, q.content)
      .sort(sortFilters)
  };

  return merged.content.length ? merged : null;
};

export const addInFilters: TMergeFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;

  const merged = {
    op: "and",
    content: ctxq.content
      .reduce((acc, ctx) => {
        const found = acc.find(
          a => a.content.field === ctx.content.field && a.op === ctx.op
        );
        if (!found) return [...acc, ctx];
        return [
          ...acc.filter(y => y.content.field !== found.content.field),
          addInValue(found, ctx)
        ].filter(Boolean);
      }, q.content)
      .sort(sortFilters)
  };

  return merged.content.length ? merged : null;
};

const mergeFns: TMergeFns = v => {
  switch (v) {
    case "toggle":
      return toggleFilters;
    case "add":
      return addInFilters;
    default:
      return replaceFilters;
  }
};

const filterByWhitelist: TFilterByWhitelist = (obj, wls) =>
  Object.keys(obj || {}).reduce(
    (acc, k) =>
      // $FlowIgnore
      wls.includes(k) ? { ...acc, [k]: obj[k] } : acc,
    {}
  );

export const mergeQuery: TMergeQuery = (q, c, mergeType, whitelist) => {
  const ctx = c || {};
  const query = q || {};
  const wlCtx = whitelist ? filterByWhitelist(ctx, whitelist) : ctx;

  // Flow doesn't see that filters is always replaced and complains about ctx.filter being a string
  const mQs: Object = {
    ...wlCtx,
    ...query
  };

  return {
    ...mQs,
    filters: mergeFns(mergeType)(
      query.filters,
      parseFilterParam(wlCtx.filters, null)
    )
  };
};

export const setFilter = ({ value, field }) => ({
  op: "and",
  content: [
    {
      op: "in",
      content: { field, value }
    }
  ]
});

export const setFilters = filterContent =>
  filterContent.length && {
    op: "and",
    content: filterContent
  };

const getDisplayValue = (value) => {
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

export const inCurrentFilters = ({ currentFilters, key, dotField }) =>
  currentFilters.some(
    f => f.content.field === dotField && f.content.value.map(v => getDisplayValue(v)).includes(key)
  );

export const getFilterValue = ({ currentFilters, dotField }) =>
  currentFilters.find(f => f.content.field === dotField);

type TMakeFilter = (
  fields: [{ field: string, value: string }],
  returnString: boolean
) => Object | string;
export const makeFilter: TMakeFilter = (fields, returnString = true) => {
  const contentArray = fields.map(item => {
    const value = _.isArray(item.value) ? item.value : item.value.split(",");

    return {
      op: "in",
      content: {
        field: item.field,
        value
      }
    };
  });

  const filters = contentArray.length
    ? {
        op: "and",
        content: contentArray
      }
    : {};

  return returnString ? JSON.stringify(filters) : filters;
};

export default makeFilter;
