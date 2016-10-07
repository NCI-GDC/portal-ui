/* @flow */
/* eslint flowtype/no-weak-types: 0 */

type TIsEmptyArray = (x: mixed) => boolean;
const isEmptyArray: TIsEmptyArray = x => !!(x && (Array.isArray(x) && x.length === 0));
type TIsEmptyObject = (x: mixed) => boolean;
const isEmptyObject: TIsEmptyObject = x => !!(x && (typeof x === 'object') && Object.keys(x).length === 0);

type TRemoveEmptyKeys = (p: Object) => Object;
export const removeEmptyKeys: TRemoveEmptyKeys = q => (
  Object.keys(q).reduce((acc, k) => {
    const v = q[k];

    return (!v || isEmptyArray(v) || isEmptyObject(v))
    ? acc
    : { ...acc, [k]: v };
  }, {})
);
