/* @flow */
export function sortInt(field) {
  return (a, b) => b[field] - a[field];
}

export function sortBool(field) {
  return (a, b) => {
    if (a[field] && !b[field]) {
      return -1;
    } else if (!a[field] && b[field]) {
      return 1;
    }

    return 0;
  };
}

export function sortByString(field) {
  return (a, b) => {
    if (a[field] > b[field]) {
      return 1;
    } else if (a[field] < b[field]) {
      return -1;
    }

    return 0;
  };
}

export default {
  sortBool,
  sortByString,
  sortInt,
};
