import { namespaceActions } from './utils';

const style = namespaceActions('dynamicStyle', ['ADD_STYLE']);

const addStyle = (key: any, value: any) => ({
  type: style.ADD_STYLE,
  payload: { key, value },
});

const initialState = {};

const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case style.ADD_STYLE:
      const { key, value } = action.payload;
      console.log(key, value, {
        ...state,
        [key]: value,
      });

      return {
        ...state,
        [key]: value,
      };
    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { addStyle };

export default reducer;
