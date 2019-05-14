import { REHYDRATE } from 'redux-persist';
// Custom
import { default as tableModels } from '@ncigdc/tableModels';
import { namespaceActions } from './utils';
/*----------------------------------------------------------------------------*/
const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
]);
import { IColumnProps } from '@ncigdc/tableModels/utils';

export interface ITableColumnsAction {
  type: string;
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
  index: number;
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
  order: Array<IColumnProps<boolean>>;
}) => ({
  type: tableColumns.SET,
  payload: { entityType, order },
});
const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key],
  }),
  { version: 5 }
);

const reducer = (state = initialState, action: ITableColumnsAction) => {
  switch (action.type) {
    case REHYDRATE: {
      const { version = -1, ...allTableColumns } =
        (action.payload && action.payload.tableColumns) || {};
      if (version !== state.version) {
        return { ...initialState };
      }
      return {
        ...state,
        ...Object.entries(
          allTableColumns || {}
        ).reduce((acc, [key, val]: [string, Array<IColumnProps<boolean>>]) => {
          const orderArray = val.map((v: IColumnProps<boolean>) => v.id);
          const order = Array.isArray(val)
            ? state[key]
                .slice()
                .sort(
                  (a: IColumnProps<boolean>, b: IColumnProps<boolean>) =>
                    orderArray.indexOf(a.id) - orderArray.indexOf(b.id)
                )
            : state[key];

          return {
            ...acc,
            [key]: order.map((element: IColumnProps<boolean>, i: number) => {
              if (val[i] && val[i].hasOwnProperty('hidden')) {
                return {
                  ...element,
                  hidden: val[i].hidden,
                };
              } else {
                return element;
              }
            }),
          };
        }, {}),
      };
    }
    case tableColumns.TOGGLE_COLUMN: {
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
    case tableColumns.RESTORE: {
      const { entityType } = action.payload;
      return {
        ...state,
        [entityType]: initialState[entityType],
      };
    }
    case tableColumns.SET: {
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
