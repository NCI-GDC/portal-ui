// @flow

function idFirst(a, b) {
  if (a[0] === 'id') {
    return -1;
  } if (b[0] === 'id') {
    return 1;
  }

  return 0;
}

export default function toMap(obj, sort = idFirst) {
  const entries = Object.entries(obj);
  return new Map(sort ? entries.sort(sort) : entries);
}
