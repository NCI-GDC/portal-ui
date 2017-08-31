export default ({ setData, type }) =>
  setData.length === 2
    ? [
        {
          op: '( S1 ∩ S2 )',
          filters: {
            op: 'and',
            content: setData.map(([setId]) => ({
              op: 'in',
              content: {
                field: `${type}s.${type}_id`,
                value: `set_id:${setId}`,
              },
            })),
          },
        },
        {
          op: '( S1 ) − ( S2 )',
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[0][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[1][0]}`],
                },
              },
            ],
          },
        },
        {
          op: '( S2 ) − ( S1 )',
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[1][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[0][0]}`],
                },
              },
            ],
          },
        },
      ]
    : [
        {
          op: '( S1 ∩ S2 ∩ S3 )',
          filters: {
            op: 'and',
            content: setData.map(([setId]) => ({
              op: 'in',
              content: {
                field: `${type}s.${type}_id`,
                value: `set_id:${setId}`,
              },
            })),
          },
        },
        {
          op: '( S1 ∩ S2 ) − ( S3 )',
          filters: {
            op: 'and',
            content: [
              ...setData.slice(0, 2).map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[2][0]}`,
                },
              },
            ],
          },
        },
        {
          op: '( S1 ∩ S3 ) − ( S2 )',
          filters: {
            op: 'and',
            content: [
              ...[setData[0], setData[2]].map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[1][0]}`,
                },
              },
            ],
          },
        },
        {
          op: '( S2 ∩ S3 ) − ( S1 )',
          filters: {
            op: 'and',
            content: [
              ...[setData[1], setData[2]].map(([setId]) => ({
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setId}`,
                },
              })),
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[0][0]}`,
                },
              },
            ],
          },
        },
        {
          op: '( S1 ) − ( S2 ∪ S3 )',
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[0][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[1][0]}`, `set_id:${setData[2][0]}`],
                },
              },
            ],
          },
        },
        {
          op: '( S2 ) − ( S1 ∪ S3 )',
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[1][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[0][0]}`, `set_id:${setData[2][0]}`],
                },
              },
            ],
          },
        },
        {
          op: '( S3 ) − ( S1 ∪ S2 )',
          filters: {
            op: 'and',
            content: [
              {
                op: 'in',
                content: {
                  field: `${type}s.${type}_id`,
                  value: `set_id:${setData[2][0]}`,
                },
              },
              {
                op: 'exclude',
                content: {
                  field: `${type}s.${type}_id`,
                  value: [`set_id:${setData[0][0]}`, `set_id:${setData[1][0]}`],
                },
              },
            ],
          },
        },
      ];
