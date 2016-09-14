export const parseIntParam = (str, defaults) => (
  str ? Math.max(parseInt(str, 10), 0) : defaults
);

export const parseJsonParam = (str, defaults) => (
  str ? JSON.parse(str) : defaults
);

export const prepareJsonParam = (obj) => (
  JSON.stringify(obj)
);

export const prepareViewerParams = (params, { location: { query } }) => ({
  offset: parseIntParam(query.offset, 0),
  first: parseIntParam(query.first, 20),
  filters: parseJsonParam(query.filters, null),
});

export const prepareNodeParams = type => params => ({
  id: btoa(`${type}:${params.id}`),
});

export default {
  parseIntParam,
  parseJsonParam,
  prepareJsonParam,
  prepareViewerParams,
  prepareNodeParams,
};
