// @flow
import _ from 'lodash';
import { compose, withState, withHandlers, withProps } from 'recompose';
import withPropsOnChange from '@ncigdc/utils/withPropsOnChange';

const getPreviousItem = (items, reference) =>
  reference ? _.nth(items, items.indexOf(reference) - 1) : _.last(items);
const getNextItem = (items, reference) =>
  reference ? _.nth(items, items.indexOf(reference) + 1) : _.first(items);

const withKeyboardSelection = (
  { keyHandlerName, listSourcePropPath },
  { onFocusItem = _.noop, onSelectItem = _.noop, onCancel = _.noop },
) =>
  compose(
    withState('focusedItem', 'setFocusedItem', undefined),
    withState('selectedItem', 'setSelectedItem', undefined),
    withProps(props => ({
      list: _.get(props, listSourcePropPath),
    })),
    withProps(
      ({ list, focusedItem, setFocusedItem, setSelectedItem, ...props }) => ({
        focusPreviousItem: () => {
          if (_.isEmpty(list)) return;
          const nextFocus = getPreviousItem(list, focusedItem);
          setFocusedItem(nextFocus);
        },
        focusNextItem: () => {
          if (_.isEmpty(list)) return;
          const nextFocus = getNextItem(list, focusedItem);
          setFocusedItem(nextFocus);
        },
        selectItem: item => {
          setSelectedItem(item);
          onSelectItem(item, { focusedItem, list, ...props });
          setFocusedItem(undefined);
        },
        cancel: () => {
          setSelectedItem(undefined);
          setFocusedItem(undefined);
          onCancel({ focusedItem, list, ...props });
        },
      }),
    ),
    withPropsOnChange(['focusedItem'], ({ focusedItem, ...props }) =>
      onFocusItem(focusedItem, props),
    ),
    withHandlers({
      [keyHandlerName]: ({
        focusedItem,
        selectItem,
        focusPreviousItem,
        focusNextItem,
        cancel,
      }) => event =>
        (({
          ArrowUp: () => {
            event.preventDefault();
            focusPreviousItem();
          },
          ArrowDown: () => {
            event.preventDefault();
            focusNextItem();
          },
          Enter: () => focusedItem && selectItem(focusedItem),
          Escape: () => cancel(),
        }[event.key] || _.noop)()),
    }),
  );

export default withKeyboardSelection;
