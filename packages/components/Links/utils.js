/* @flow */

import React from 'react';

import Link from './Link';

import type { LinkPropsType } from './types';

type IdLinkConfigType = {|
  pathname: string,
|};

type LinkConfigType = {|
  children: string,
  pathname: string,
|};

type IdLinkPropsType = {
  id: string,
} & LinkPropsType;

type MakeLinkBaseType = (p: LinkPropsType) => React.Element<LinkPropsType>;
const makeLinkBase: MakeLinkBaseType = props => <Link {...props} />;

type MakeIdLinkType = (c: IdLinkConfigType) => (p: IdLinkPropsType) => React.Element<LinkPropsType>;
export const makeIDLink: MakeIdLinkType = config => props => {
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

type MakeLinkType = (c: LinkConfigType) => (p: LinkPropsType) => React.Element<LinkPropsType>;
export const makeLink: MakeLinkType = config => props => makeLinkBase({ ...config, ...props });

