/*
 * Copied from recompose to move the first call to `propsMapper`.
 * Prevents setState warning.
 */

import { createFactory, Component } from 'react';
import pick from 'recompose/utils/pick';
import shallowEqual from 'recompose/shallowEqual';
import setDisplayName from 'recompose/setDisplayName';
import wrapDisplayName from 'recompose/wrapDisplayName';

const withPropsOnChange = (shouldMapOrKeys, propsMapper) => BaseComponent => {
  const factory = createFactory(BaseComponent);
  const shouldMap =
    typeof shouldMapOrKeys === 'function'
      ? shouldMapOrKeys
      : (props, nextProps) => !shallowEqual(
        pick(props, shouldMapOrKeys),
        pick(nextProps, shouldMapOrKeys),
      );

  class WithPropsOnChange extends Component {
    computedProps = {};

    componentWillMount() {
      // move first `propsMapper` call into componentWillMount incase there is a setState in it
      this.computedProps = propsMapper(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (shouldMap(this.props, nextProps)) {
        this.computedProps = propsMapper(nextProps);
      }
    }

    render() {
      return factory({
        ...this.props,
        ...this.computedProps,
      });
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return setDisplayName(wrapDisplayName(BaseComponent, 'withPropsOnChange'))(
      WithPropsOnChange,
    );
  }
  return WithPropsOnChange;
};

export default withPropsOnChange;
