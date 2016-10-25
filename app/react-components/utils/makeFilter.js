import _ from 'lodash';

function makeFilter(fields: { field: string; value: string }[]) {
  const contentArray = _.map(fields, (item) => {
    let value;

    if (_.isArray(item.value)) {
      value = item.value;
    } else if (item.value) {
      value = item.value.split(',');
    }

    return {
      op: 'in',
      content: {
        field: item.field,
        value,
      },
    };
  });

  return contentArray.length === 0 ? '{}' : JSON.stringify({
    op: 'and',
    content: contentArray,
  });
}

export default makeFilter;
