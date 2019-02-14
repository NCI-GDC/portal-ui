/* @flow */

import React from 'react';

import Link from './Link';

import { IListLinkProps, IIdLinkProps, TLinkProps } from './types';

type TIdLinkConfig = {
  pathname: string,
};

type TListLinkConfig = {
  children: string,
  pathname: string,
  query?: Object,
};

type TMakeLinkBase = (p: TLinkProps) => React.Element<>;
const makeLinkBase: TMakeLinkBase = props => <Link {...props} />;

type TMakeIdLink = (c: TIdLinkConfig) => (p: IIdLinkProps) => React.Element<>;
export const makeIDLink: TMakeIdLink = config => props => {
  const pathname = `${config.pathname}/${props.uuid}`;
  const children = props.children || props.uuid;

  return makeLinkBase({
    ...props,
    pathname,
    children,
  });
};

export type TMakeListLink = (
  c: TListLinkConfig
) => (p: IListLinkProps) => React.Element<>;
export const makeListLink: TMakeListLink = ({
  query: configQuery,
  ...config
}) => ({ query, ...props }) =>
  makeLinkBase({ query: { ...configQuery, ...query }, ...config, ...props });
