type TGroupByType = (type: string, data: object[]) => object;
const groupByType: TGroupByType = (type, data) => data.reduce(
  (acc, val) => ({
    ...acc,
    [val[type]]: acc[val[type]] ? [...acc[val[type]], val] : [val],
  }),
  {}
);

export default groupByType;
