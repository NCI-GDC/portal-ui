/* @flow */
type TSortFunctionGenerator = (field: string) => (a: {}, b: {}) => number;

export const sortInt: TSortFunctionGenerator = field => {
  return (a, b) => {
    if (b[field] !== a[field]) {
      return b[field] - a[field];
    }
    return defaultSort(a, b);
  };
};

export const sortBool: TSortFunctionGenerator = field => {
  return (a, b) => {
    if (a[field] && !b[field]) {
      return -1;
    } if (!a[field] && b[field]) {
      return 1;
    }
    return defaultSort(a, b);
  };
};

export const sortByString: TSortFunctionGenerator = field => {
  return (a, b) => {
    if (a[field] > b[field]) {
      return 1;
    } if (a[field] < b[field]) {
      return -1;
    }
    return defaultSort(a, b);
  };
};

const defaultSort = sortByString('id');

export default {
  sortBool,
  sortByString,
  sortInt,
};
