export const sortInt = function (field) {
  return function (a, b) {
    return b[field] - a[field];
  };
};

export const sortBool = function (field) {
  return function (a, b) {
    if (a[field] && !b[field]) {
      return -1;
    } else if (!a[field] && b[field]) {
      return 1;
    } else {
      return 0;
    }
  };
};

export const sortByString = function (field) {
  return function (a, b) {
    if (a[field] > b[field]) {
      return 1;
    } else if (a[field] < b[field]) {
      return -1;
    } else {
      return 0;
    }
  };
};

export default {
  sortBool,
  sortByString,
  sortInt,
};
