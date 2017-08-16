/* @flow */
import jsurl from 'jsurl';

import type {
  TIsEmptyArray,
  TIsEmptyObject,
  TRemoveEmptyKeys,
  TParseFilterParam,
  TParseJSONParam,
  TParseIntParam,
} from './types';

export const isEmptyArray: TIsEmptyArray = x =>
  !!(x && (Array.isArray(x) && x.length === 0));

export const isEmptyObject: TIsEmptyObject = x =>
  !!(x && typeof x === 'object' && Object.keys(x).length === 0);

export const removeEmptyKeys: TRemoveEmptyKeys = q =>
  Object.keys(q).reduce((acc, k) => {
    const v = q[k];

    return !v || isEmptyArray(v) || isEmptyObject(v) ? acc : { ...acc, [k]: v };
  }, {});

export const parseIntParam: TParseIntParam = (str, defaults) =>
  str ? Math.max(parseInt(str, 10), 0) : defaults;

export const parseJSONParam: TParseJSONParam = (str, defaults) => {
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

export const stringifyJSONParam: TParseJSONParam = (str, defaults) =>
  str ? JSON.stringify(str) : defaults;

export const parseFilterParam: TParseFilterParam = parseJSONParam;
