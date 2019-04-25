import jsurl from 'jsurl';
import {
  TParseFilterParam,
  TParseIntParam,
  TParseJSONParam,
} from './types';

export const parseIntParam: TParseIntParam = (str, defaults = null) => (str ? Math.max(parseInt(str, 10), 0) : defaults);

export const parseJSONParam: TParseJSONParam = (str, defaults = {}) => {
  if (str) {
    try {
      return JSON.parse(str) || defaults;
    } catch (err) {
      return jsurl.parse(str) || defaults;
    }
  } else {
    return defaults;
  }
};

export const stringifyJSONParam: TParseJSONParam = (str, defaults) => (str ? JSON.stringify(str) : defaults);

export const parseFilterParam: TParseFilterParam = parseJSONParam;
