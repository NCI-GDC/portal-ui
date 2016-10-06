/* @flow */

import React from 'react';

import Link from './Link';

import type { TLinkProps } from './types';

type TIdLinkConfig = {|
  pathname: string,
|};

type TLinkConfig = {|
  children: string,
  pathname: string,
|};

type TIdLinkProps = {
  id: string,
} & TLinkProps;

type TMakeLinkBase = (p: TLinkProps) => React.Element<TLinkProps>;
const makeLinkBase: TMakeLinkBase = props => <Link {...props} />;

type TMakeIdLink = (c: TIdLinkConfig) => (p: TIdLinkProps) => React.Element<TLinkProps>;
export const makeIDLink: TMakeIdLink = config => props => {
  const pathname = `${config.pathname}/${props.id}`;
  const children = props.children || props.id;

  return (
    makeLinkBase({
      ...props,
      pathname,
      children,
    })
  );
};

type TMakeLink = (c: TLinkConfig) => (p: TLinkProps) => React.Element<TLinkProps>;
export const makeLink: TMakeLink = config => props => makeLinkBase({ ...config, ...props });

