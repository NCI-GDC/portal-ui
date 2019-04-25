export default ({ setIds, type }) => {
  const makeFilter = (op, id) => ({
    op,
    content: {
      field: `${type}s.${type}_id`,
      value: `set_id:${id}`,
    },
  });

  const mapOp = (op, sets) => {
    return {
      op,
      filters: {
        op: 'and',
        content: [
          ...(sets.in || []).map(setId => makeFilter('in', setId)),
          ...(sets.exclude || []).map(setId => makeFilter('exclude', setId)),
        ],
      },
    };
  };

  return setIds.length === 2
    ? [
        mapOp('( S1 ∩ S2 )', { in: setIds }),
        mapOp('( S1 ) - ( S2 )', {
          in: setIds.slice(0, 1),
          exclude: setIds.slice(1),
        }),
        mapOp('( S2 ) - ( S1 )', { in: [setIds[1]], exclude: [setIds[0]] }),
      ]
    : [
        mapOp('( S1 ∩ S2 ∩ S3 )', { in: setIds }),
        mapOp('( S1 ∩ S2 ) - ( S3 )', {
          in: setIds.slice(0, 2),
          exclude: [setIds[2]],
        }),
        mapOp('( S2 ∩ S3 ) - ( S1 )', {
          in: [setIds[1], setIds[2]],
          exclude: [setIds[0]],
        }),
        mapOp('( S1 ∩ S3 ) - ( S2 )', {
          in: [setIds[0], setIds[2]],
          exclude: [setIds[1]],
        }),
        mapOp('( S1 ) - ( S2 ∪ S3 )', {
          in: [setIds[0]],
          exclude: [setIds[1], setIds[2]],
        }),
        mapOp('( S2 ) - ( S1 ∪ S3 )', {
          in: [setIds[1]],
          exclude: [setIds[0], setIds[2]],
        }),
        mapOp('( S3 ) - ( S1 ∪ S2 )', {
          in: [setIds[2]],
          exclude: [setIds[0], setIds[1]],
        }),
      ];
};
