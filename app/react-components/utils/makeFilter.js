import _ from 'lodash';

function makeFilter(fields: { field: string; value: string }[], returnString: boolean = true) {
  const contentArray = _.map(fields, (item) => {
    const value = _.isArray(item.value) ? item.value : item.value.split(',');

    return {
      op: 'in',
      content: {
        field: item.field,
        value,
      },
    };
  });

  const filters = contentArray.length ? {
    op: 'and',
    content: contentArray,
  } : {};

  return returnString ? JSON.stringify(filters) : filters;
}

export default makeFilter;
