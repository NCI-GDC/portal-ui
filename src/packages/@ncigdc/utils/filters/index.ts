import { isArray, isEqual, uniqWith } from 'lodash';
import { parseFilterParam } from '../uri';
import {
  IGroupFilter,
  IValueFilter,
  TCombineValues,
  TFilterByWhitelist,
  TFilterOperation,
  TFilterValue,
  TMergeFilters,
  TMergeFiltersNullable,
  TMergeFns,
  TMergeQuery,
  TRemoveFilter,
  TSortFilters,
} from './types';

function compareTerms(a: IValueFilter, b: IValueFilter): boolean {
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

const combineValues = (x: TFilterValue, y: TFilterValue): TFilterValue =>
  uniqWith([...x, ...y], isEqual);

const combineFilterValues: TCombineValues = (x, y) => {
  const xValue = ([] as TFilterValue).concat(x.content.value || []);
  const yValue = ([] as TFilterValue).concat(y.content.value || []);

  if (xValue.length === 0 && yValue.length === 0) {
    return null;
  } else if (xValue.length === 0) {
    return y;
  } else if (yValue.length === 0) {
    return x;
  }

  const merged: IValueFilter = {
    op: 'in',
    content: {
      field: x.content.field,
      value: combineValues(xValue, yValue).sort(),
    },
  };

  return merged.content.value.length ? merged : null;
};

const toggle: TMergeFilters = (x, y) => ({
  op: 'and',
  content: y.content
    .reduce((acc, ctx) => {
      const found = acc.find(a => compareTerms(a, ctx));
      if (!found) {
        return [...acc, ctx];
      }
      return [
        ...acc.filter(f => f.content.field !== found.content.field),
        // combineFilterValues(found, ctx),
      ].filter(Boolean);
    }, x.content)
    .sort(sortFilters),
});

const replace: TMergeFilters = (x, y) => ({
  op: 'and',
  content: y.content
    .reduce((acc, ctx) => {
      const found = acc.find(a => compareTerms(a, ctx));
      if (!found) {
        return [...acc, ctx];
      }
      return acc;
    }, x.content)
    .sort(sortFilters),
});

const addIn: TMergeFilters = (x, y) => ({
  op: 'and',
  content: y.content
    .reduce((acc, ctx) => {
      const found = acc.find(a => compareTerms(a, ctx));
      if (!found) {
        return [...acc, ctx];
      }
      return [
        ...acc.filter(f => f.content.field !== found.content.field),
        combineFilterValues(found, ctx),
      ].filter(Boolean);
    }, x.content)
    .sort(sortFilters),
});

const filterNoContent = (f: IGroupFilter) => (f.content.length ? f : null);

const filterOperation: TFilterOperation = (t, x, y) => {
  if (!x && !y) {
    return null;
  } else if (!y) {
    return x;
  } else if (!x) {
    return y;
  }

  switch (t) {
    case 'toggle':
      return filterNoContent(toggle(x, y));
    case 'replace':
      return filterNoContent(replace(x, y));
    case 'add':
      return filterNoContent(addIn(x, y));
    default:
      return null;
  }
};

export const toggleFilters: TMergeFiltersNullable = (x, y) =>
  filterOperation('toggle', x, y);
export const replaceFilters: TMergeFiltersNullable = (x, y) =>
  filterOperation('replace', x, y);
export const addInFilters: TMergeFiltersNullable = (x, y) =>
  filterOperation('add', x, y);

const mergeFns: TMergeFns = v => {
  switch (v) {
    case 'toggle':
      return toggleFilters;
    case 'add':
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
    ...query,
  };

  return {
    ...mQs,
    filters: mergeFns(mergeType)(
      query.filters,
      parseFilterParam(wlCtx.filters, null)
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

export const innerJoinFilters = (q, ctxq) => {
  if (!ctxq && !q) return null;
  if (!ctxq) return q;
  if (!q) return ctxq;
  const merged = {
    op: 'and',
    content: ctxq.content.reduce((acc, ctx) => {
      console.log('ctx', ctx);
      const found = acc.find(a => a.content.field === ctx.content.field);
      if (!found) return [...acc, ctx];
      return [
        ...acc.filter(y => y.content.field !== found.content.field),
        {
          op: 'in',
          content: {
            field: ctx.content.field,
            value: ctx.content.value.filter(v =>
              found.content.value.includes(v)
            ),
          },
        },
      ].filter(Boolean);
    }, q.content),
    // .sort(sortFilters),
  };

  return merged.content.length ? merged : null;
};

// true if field and value in
export const inCurrentFilters = ({ currentFilters, key, dotField }) =>
  currentFilters.some(
    f =>
      f.content.field === dotField &&
      []
        .concat(f.content.value || [])
        .map(v => getDisplayValue(v))
        .includes(key)
  );

// true if field in
export const fieldInCurrentFilters = ({ currentFilters, field }) =>
  currentFilters.some(f => f.content.field === field);

export const getFilterValue = ({ currentFilters, dotField }) =>
  currentFilters.find(f => f.content.field === dotField);

type TMakeFilter = (
  fields: Array<{ field: string; value: string }>
) => IGroupFilter | {};
export const makeFilter: TMakeFilter = fields => {
  if (!fields.length) {
    return {};
  } else {
    return {
      op: 'and',
      content: fields.map(item => {
        const value = isArray(item.value) ? item.value : item.value.split(',');
        return {
          op: 'in',
          content: {
            field: item.field,
            value,
          },
        };
      }),
    };
  }
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
