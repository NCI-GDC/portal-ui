const makeCategoricalActionsFilters = ({ fieldName, filters, selectedBins }) => {
  const filteredSelectedBins = selectedBins
    .filter(bin => bin.key !== '_missing');
  const includesMissing = filteredSelectedBins.length - selectedBins.length > 0;

  const binFilters = []
    .concat(filteredSelectedBins.length > 0 && [
      {
        content: {
          field: fieldName,
          value: filteredSelectedBins
            .reduce((acc, selectedBin) =>
              [...acc, ...selectedBin.keyArray], []),
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
    ...binFilters.length > 0 && {
      content: filters.content
        .concat(
          binFilters.length > 1
            ? {
              content: binFilters,
              op: 'or',
            }
            : binFilters[0],
        ),
    },
  };
};

export default makeCategoricalActionsFilters;
