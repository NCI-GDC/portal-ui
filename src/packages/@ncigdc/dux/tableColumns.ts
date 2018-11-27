// Custom
import tableModels from '@ncigdc/tableModels';
import { namespaceActions } from './utils';

/*----------------------------------------------------------------------------*/

const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
]);
enum TableColumnsTypes {
  TOGGLE_COLUMN = 'TOGGLE_COLUMN',
  RESTORE = 'RESTORE',
  SET = 'SET',
  REHYDRATE = 'persist/REHYDRATE',
}
export interface ITableColumnsAction {
  type: TableColumnsTypes;
  payload: {
    entityType: string;
    [x: string]: any;
  };
}

const toggleColumn = ({
  entityType,
  index,
}: {
  entityType: string;
  index: string;
}) => ({
  type: tableColumns.TOGGLE_COLUMN,
  payload: { entityType, index },
});

const restoreColumns = (entityType: string) => ({
  type: tableColumns.RESTORE,
  payload: { entityType },
});

const setColumns = ({
  entityType,
  order,
}: {
  entityType: string;
  order: any;
}) => ({
  type: tableColumns.SET,
  payload: { entityType, order },
});

// Store ids of table items that are not hidden by default
// const reduceColumns = (acc, x) => [...acc, ...(!x.hidden ? [x.id] : [])];

const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key],
  }),
  { version: 3 }
);

const reducer = (state = initialState, action: ITableColumnsAction) => {
  switch (action.type) {
    case TableColumnsTypes.REHYDRATE: {
      const { version = -1, ...allTableColumns } =
        action.payload.tableColumns || {};
      if (version !== state.version) {
        return state;
      }
      return {
        ...state,
        ...Object.entries(
          allTableColumns || {}
        ).reduce((acc, [key, val]: [string, any]) => {
          const orderArray = val.map((v: any) => v.id);
          const order = Array.isArray(val)
            ? state[key]
                .slice()
                .sort(
                  (a: any, b: any) =>
                    orderArray.indexOf(a.id) - orderArray.indexOf(b.id)
                )
            : state[key];
          order.forEach((element: any, i: number) => {
            element.hidden = val[i].hidden;
          });
          return {
            ...acc,
            [key]: order,
          };
        }, {}),
      };
    }

    case TableColumnsTypes.TOGGLE_COLUMN: {
      const { entityType, index } = action.payload;
      return {
        ...state,
        [entityType]: [
          ...state[entityType].slice(0, index),
          {
            ...state[entityType][index],
            hidden: !state[entityType][index].hidden,
          },
          ...state[entityType].slice(index + 1, Infinity),
        ],
      };
    }

    case TableColumnsTypes.RESTORE: {
      const { entityType } = action.payload;
      return {
        ...state,
        [entityType]: initialState[entityType],
      };
    }

    case TableColumnsTypes.SET: {
      const { entityType, order } = action.payload;
      return { ...state, [entityType]: order.slice() };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns };
export default reducer;
