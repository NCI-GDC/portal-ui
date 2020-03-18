/* @flow */

import React from 'react';
import { connect } from 'react-redux';
import Link from './Link';

type TProps = {
  children?: Function,
  className?: string,
  count: number,
  style?: Object,
};

class CartLink extends React.Component {
  shouldComponentUpdate({
    count: nextCount,
  }) {
    const {
      count,
    } = this.props;

    return nextCount !== count;
  }

  render() {
    const {
      children,
      className = '',
      count = 0,
      onClick,
      style = {},
      testTag,
    } = this.props;
    return (
      <Link
        className={className}
        onClick={onClick}
        pathname="/cart"
        style={style || {}}
        testTag={testTag}
        >
        {children ? children(count) : 'cart'}
      </Link>
    );
  }
}

export default connect(
  state => ({ count: state.cart.files.length }),
)(CartLink);
