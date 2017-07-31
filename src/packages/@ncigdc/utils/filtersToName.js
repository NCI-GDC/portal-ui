function getValues(filters) {
  const content = filters.content;
  if (Array.isArray(content)) {
    return content.reduce((acc, c) => [...acc, ...getValues(c)], []);
  } else {
    return [[].concat(content.value || [])];
  }
}

const MAX_VALUES = 6;
export default function filtersToName(filters, max = MAX_VALUES) {
  if (!filters) return '';
  const values = getValues(filters);
  let total = 0;
  return values
    .reduce((acc, value, i, arr) => {
      if (total >= MAX_VALUES) return acc;
      const joined = value.slice(0, MAX_VALUES - total).join(' / ');
      total += value.length;
      return acc.concat(
        `${joined}${total > MAX_VALUES ||
          (total === MAX_VALUES && i < arr.length - 1)
          ? '...'
          : ''}`,
      );
    }, [])
    .join(', ');
}
