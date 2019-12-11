const makeCategoricalActionsFilters = (selectedBuckets, fieldName, filters) => {
  const filteredSelectedBuckets = selectedBuckets
    .filter(bucket => bucket.key !== '_missing');
  const includesMissing = filteredSelectedBuckets.length - selectedBuckets.length > 0;

  const bucketFilters = []
    .concat(filteredSelectedBuckets.length > 0 && [
      {
        content: {
          field: fieldName,
          value: filteredSelectedBuckets
            .reduce((acc, selectedBucket) =>
              [...acc, ...selectedBucket.keyArray], []),
        },
        op: 'in',
      },
    ])
    .concat(includesMissing &&
      [
        {
          content: {
            field: fieldName,
            value: 'MISSING',
          },
          op: 'is',
        },
      ])
    .filter(item => item);

  return {
    ...filters,
    ...bucketFilters.length > 0 && {
      content: filters.content
        .concat(
          bucketFilters.length > 1
            ? {
              content: bucketFilters,
              op: 'or',
            }
            : bucketFilters[0],
        ),
    },
  };
};

export default makeCategoricalActionsFilters;
