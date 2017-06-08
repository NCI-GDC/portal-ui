/* @flow */

import React from 'react';

import Link from './Link';

import type { TListLinkProps, TIdLinkProps, TLinkProps } from './types';

type TIdLinkConfig = {|
  pathname: string,
|};

type TListLinkConfig = {|
  children: string,
  pathname: string,
  query?: Object,
|};

type TMakeLinkBase = (p: TLinkProps) => React.Element<>;
const makeLinkBase: TMakeLinkBase = props => <Link {...props} />;

type TMakeIdLink = (c: TIdLinkConfig) => (p: TIdLinkProps) => React.Element<>;
export const makeIDLink: TMakeIdLink = config => props => {
  const pathname = `${config.pathname}/${props.uuid}`;
  const children = props.children || props.uuid;

  return makeLinkBase({
    ...props,
    pathname,
    children,
  });
};

type TMakeListLink = (
  c: TListLinkConfig,
) => (p: TListLinkProps) => React.Element<>;
export const makeListLink: TMakeListLink = ({
  query: configQuery,
  ...config
}) => ({ query, ...props }) =>
  makeLinkBase({ query: { ...configQuery, ...query }, ...config, ...props });
