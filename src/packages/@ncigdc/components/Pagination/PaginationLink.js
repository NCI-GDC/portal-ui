/* @flow */

import React from 'react';

import Link from '@ncigdc/components/Links/Link';

export type TProps = {
  children?: string,
  offset: number,
  pred: boolean,
  prfOff: string,
  style?: Object,
  className?: Object,
};

const PaginationLink = (props: TProps) =>
  props.pred ? (
    <Link
      merge
      query={{ [props.prfOff]: props.offset }}
      style={props.style || {}}
      className={props.className || 'test-pagination-link'}
    >
      {props.children}
    </Link>
  ) : (
    <span>{props.children}</span>
  );

export default PaginationLink;
