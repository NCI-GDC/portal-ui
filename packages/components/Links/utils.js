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
|};

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

type TMakeListLink = (c: TListLinkConfig) => (p: TListLinkProps) => React.Element<TListLinkProps>;
export const makeListLink: TMakeListLink = config => props => makeLinkBase({ ...config, ...props });

