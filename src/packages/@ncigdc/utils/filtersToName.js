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

const EXPLORE_TABLE_VALUES = ['genes.gene_id', 'ssms.ssm_id', 'cases.case_id'];

function filterIsID(filters) {
  const content = filters.content;
  if (!content) {
    return [];
  } else if (Array.isArray(content)) {
    return content.find(c => {
      const field = c.content.field;
      return field && EXPLORE_TABLE_VALUES.includes(field);
    });
  } else {
    return false;
  }
}

const MAX_VALUES = 6;
export default function({
  filters,
  max = MAX_VALUES,
  sets,
  length = Infinity,
  displayType,
}) {
  if (!filters) return '';
  // if filters are items selected from table, return default custom selection name
  if (filterIsID(filters)) {
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
