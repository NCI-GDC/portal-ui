function getValues(filters: Object, sets: Object) {
  const content: ?Array<Object> = filters.content;
  if (!content) {
    return [];
  } else if (Array.isArray(content)) {
    return content.reduce(
      (acc: Array<?string>, c: Object) => [...acc, ...getValues(c, sets)],
      [],
    );
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

const MAX_VALUES: number = 6;
export default function({
  filters,
  max = MAX_VALUES,
  sets,
  length = Infinity,
}) {
  if (!filters) return '';
  const values: Array<string> = getValues(
    filters,
    Object.values(sets).reduce((a, b) => ({ ...a, ...b }), {}),
  );

  let total: number = 0;
  const name: string = values
    .reduce(
      (
        acc: Array<?string>,
        value: Array<string>,
        i: number,
        arr: Array<Array<string>>,
      ) => {
        if (total >= MAX_VALUES) return acc;
        const joined: string = value.slice(0, MAX_VALUES - total).join(' / ');
        total += value.length;
        return acc.concat(
          `${joined}${total > MAX_VALUES ||
          (total === MAX_VALUES && i < arr.length - 1)
            ? '...'
            : ''}`,
        );
      },
      [],
    )
    .join(', ');
  return name.length <= length
    ? name
    : name.slice(0, length - 3).replace(/[, ./]*$/, '...');
}
