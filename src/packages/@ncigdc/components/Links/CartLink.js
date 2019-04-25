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

const CartLink = (props: TProps) => (
  <Link
    className={props.className || ''}
    pathname="/cart"
    style={props.style || {}}>
    {props.children ? props.children(props.count) : 'cart'}
  </Link>
);

export default connect(state => ({ count: state.cart.files.length }))(CartLink);
