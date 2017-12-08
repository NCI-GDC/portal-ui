import _ from 'lodash';

function getValues(filters, sets) {
  const content = filters.content;
  if (!content) {
    return [];
  } else if (Array.isArray(content)) {
    return content.reduce((acc, c) => [...acc, ...getValues(c, sets)], []);
  } else {
    return [
      []
        .concat(content.value || [])
        .map(
          v =>
            typeof v === 'string' && v.includes('set_id:')
              ? sets[v.replace('set_id:', '')] || 'input set'
              : v,
        ),
    ];
  }
}

const MAX_VALUES = 6;
export default function({
  filters,
  max = MAX_VALUES,
  sets,
  length = Infinity,
  displayType,
  selectedIds,
}) {
  if (!filters) return '';
  // if filters are items selected from table, return default custom selection name
  if (selectedIds.length) {
    return `Custom ${_.capitalize(displayType)} Selection`;
  }
  const values = getValues(
    filters,
    Object.values(sets).reduce((a, b) => ({ ...a, ...b }), {}),
  );

  let total = 0;
  const name = values
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
  return name.length <= length
    ? name
    : name.slice(0, length - 3).replace(/[, ./]*$/, '...');
}
